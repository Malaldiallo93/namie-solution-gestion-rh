import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function CongesAbsences() {
  // Jours fériés français 2025 (format : { month: 6, day: 14, label: 'Fête Nationale' })
  const holidays = [
    { month: 0, day: 1, label: 'Jour de l’An' },
    { month: 3, day: 21, label: 'Lundi de Pâques' },
    { month: 4, day: 1, label: 'Fête du Travail' },
    { month: 4, day: 8, label: 'Victoire 1945' },
    { month: 4, day: 29, label: 'Ascension' },
    { month: 5, day: 9, label: 'Lundi de Pentecôte' },
    { month: 6, day: 14, label: 'Fête Nationale' },
    { month: 7, day: 15, label: 'Assomption' },
    { month: 10, day: 1, label: 'Toussaint' },
    { month: 10, day: 11, label: 'Armistice 1918' },
    { month: 11, day: 25, label: 'Noël' },
  ];

  // Compteurs fictifs variés
  const [counters] = useState([
    { label: 'Naissance / Adoption', solde: -3, poses: 2, aAcquerir: 1, estime: -2 },
    { label: 'RTT 2023', solde: 2, poses: 1, aAcquerir: 0, estime: 1 },
    { label: 'RTT 2024', solde: 1.5, poses: 0.5, aAcquerir: 0, estime: 1 },
    { label: 'RTT 2025', solde: 1, poses: 0, aAcquerir: 1, estime: 2 },
    { label: 'Congés Payés 2024/2025', solde: 13.5, poses: 3, aAcquerir: 0, estime: 10.5 },
    { label: 'Congés Payés 2025/2026', solde: 2.5, poses: 0, aAcquerir: 2.5, estime: 5 },
  ]);
  const [selectedEstime, setSelectedEstime] = useState('juillet 2025');
  const [holidayTooltip, setHolidayTooltip] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); // [{monthIdx, day}]
  const [showPoseForm, setShowPoseForm] = useState(false);
  const [motif, setMotif] = useState('vacation');
  const motifs = [
    { value: 'vacation', label: 'Vacances' },
    { value: 'sick', label: 'Maladie' },
    { value: 'personal', label: 'Personnel' },
    { value: 'rtt', label: 'RTT' },
    { value: 'maternity', label: 'Maternité' },
    { value: 'paternity', label: 'Paternité' },
  ];

  const [monthCount, setMonthCount] = useState(4); // 2, 4, 6
  const [rangeSelect, setRangeSelect] = useState({ start: null, end: null });

  // Compteurs dynamiques pour dashboard
  const [daysLeft, setDaysLeft] = useState(25);
  const [daysTaken, setDaysTaken] = useState(0);
  const [rtt, setRtt] = useState(0);

  // Générer dynamiquement les mois à afficher à partir de juillet 2025
  const baseMonths = [
    { name: 'Juillet 2025', days: 31, startDay: 1, monthIdx: 6, year: 2025 },
    { name: 'Août 2025', days: 31, startDay: 5, monthIdx: 7, year: 2025 },
    { name: 'Septembre 2025', days: 30, startDay: 1, monthIdx: 8, year: 2025 },
    { name: 'Octobre 2025', days: 31, startDay: 3, monthIdx: 9, year: 2025 },
    { name: 'Novembre 2025', days: 30, startDay: 5, monthIdx: 10, year: 2025 },
    { name: 'Décembre 2025', days: 31, startDay: 0, monthIdx: 11, year: 2025 },
  ];
  const months = baseMonths.slice(0, monthCount);

  // Sélection multi-jours par plage ou individuel
  const toggleDay = (monthIdx, day, isHoliday) => {
    if (isHoliday) return;
    const key = `${monthIdx}-${day}`;
    // Si plage en cours
    if (rangeSelect.start && !rangeSelect.end) {
      // Si clic sur le même jour, reset
      if (rangeSelect.start.key === key) {
        setRangeSelect({ start: null, end: null });
        setSelectedDays([]);
        return;
      }
      // Calculer la plage
      const allDays = [];
      let selecting = false;
      for (const m of months) {
        for (let d = 1; d <= m.days; d++) {
          const k = `${m.monthIdx}-${d}`;
          const isH = isHolidayFct(m.monthIdx, d);
          if (k === rangeSelect.start.key || k === key) selecting = !selecting || k === key;
          if ((selecting || k === rangeSelect.start.key || k === key) && !isH) {
            allDays.push({ monthIdx: m.monthIdx, day: d, key: k });
          }
          if (k === rangeSelect.start.key && k === key) break;
          if (k === key && k !== rangeSelect.start.key) break;
        }
        if (allDays.length && allDays[allDays.length-1].key === key) break;
      }
      setSelectedDays(allDays);
      setRangeSelect({ start: null, end: null });
    } else {
      // Si déjà sélectionné, désélectionner
      if (selectedDays.some(d => d.key === key)) {
        setSelectedDays(selectedDays.filter(d => d.key !== key));
        setRangeSelect({ start: null, end: null });
      } else {
        setRangeSelect({ start: { monthIdx, day, key }, end: null });
        setSelectedDays([{ monthIdx, day, key }]);
      }
    }
  };

  // Pour compatibilité, fonction pour savoir si un jour est férié
  const isHolidayFct = (monthIdx, day) => holidays.find(h => h.month === monthIdx && h.day === day);

  // Fonction pour savoir si un jour est weekend (samedi ou dimanche)
  const isWeekend = (startDay, i) => {
    const dayOfWeek = (i + startDay) % 7;
    return dayOfWeek === 5 || dayOfWeek === 6;
  };

  // Réinitialiser la sélection après validation
  const handlePose = (e) => {
    e.preventDefault();
    setShowPoseForm(false);
    setDaysTaken(prev => prev + selectedDays.length);
    setDaysLeft(prev => prev - selectedDays.length);
    setSelectedDays([]);
    setMotif('vacation');
    alert('Jours posés avec succès (fictif) !');
  };

  const weekDays = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];

  // Suivi personnel interactif
  const [personalPanel, setPersonalPanel] = useState(null); // 'recap', 'history', 'actions', null

  // Données fictives pour les panels
  const recapData = {
    totalPoses: daysTaken,
    totalRestants: daysLeft,
    rtt: rtt,
    annee: 2025,
  };
  const historyData = [
    { date: '10/07/2025', motif: 'Vacances', statut: 'Validé' },
    { date: '15/08/2025', motif: 'RTT', statut: 'En attente' },
    { date: '01/09/2025', motif: 'Maladie', statut: 'Refusé' },
  ];
  const actionsData = [
    'Vous avez posé 2 jours le 10/07/2025',
    'Votre solde a été mis à jour le 01/07/2025',
    'Vous avez consulté votre historique le 15/06/2025',
  ];

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header + selects */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">Faire une demande</h1>
          <div className="flex gap-2">
            <select
              className="form-select border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
              value={monthCount}
              onChange={e => setMonthCount(Number(e.target.value))}
            >
              <option value={2}>2 mois</option>
              <option value={4}>4 mois</option>
              <option value={6}>6 mois</option>
            </select>
          </div>
        </div>

        {/* Légende calendrier */}
        <div className="flex items-center gap-6 mb-2 text-sm">
          <span className="flex items-center"><span className="inline-block w-4 h-4 rounded bg-red-500 mr-1"></span>Weekend</span>
          <span className="flex items-center"><span className="inline-block w-4 h-4 rounded bg-green-400 mr-1"></span>Jour férié</span>
          <span className="flex items-center"><span className="inline-block w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border mr-1"></span>Jour ouvré</span>
        </div>

        {/* Calendrier horizontal */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 mb-8">
          <div className="flex flex-col gap-2">
            {months.map((month, idx) => (
              <div key={month.name} className="flex items-center gap-4">
                <div className="w-32 text-gray-700 dark:text-gray-200 font-medium">{month.name}</div>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: month.days }).map((_, i) => {
                    const day = i + 1;
                    const holiday = isHolidayFct(month.monthIdx, day);
                    const weekend = isWeekend(month.startDay, i);
                    const isSelected = selectedDays.some(d => d.monthIdx === month.monthIdx && d.day === day);
                    return (
                      <div
                        key={i}
                        className={`w-8 h-10 flex flex-col items-center justify-center rounded-md text-xs font-medium cursor-pointer relative
                          ${holiday ? 'bg-green-400 text-green-900 border border-green-600' :
                            isSelected ? 'bg-violet-500 text-white border-2 border-violet-700' :
                            weekend ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border dark:border-gray-600'}
                          hover:shadow-md`}
                        onClick={() => toggleDay(month.monthIdx, day, holiday)}
                        onMouseLeave={() => setHolidayTooltip(null)}
                        title={holiday ? holiday.label : weekend ? 'Weekend' : 'Jour ouvré'}
                      >
                        {weekDays[(i+month.startDay)%7]}
                        <span className={`block text-[10px] font-bold ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{day}</span>
                        {holiday && <span className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full"></span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Tooltip jour férié */}
            {holidayTooltip && (
              <div style={{ position: 'fixed', left: holidayTooltip.x, top: holidayTooltip.y, zIndex: 50 }} className="bg-green-100 dark:bg-green-900 border border-green-600 dark:border-green-700 text-green-900 dark:text-green-100 px-4 py-2 rounded shadow-xl">
                {holidayTooltip.label}
              </div>
            )}
          </div>
          {/* Bouton poser jours */}
          {selectedDays.length > 0 && !showPoseForm && (
            <div className="mt-4 flex justify-end">
              <button className="btn bg-violet-600 hover:bg-violet-700 text-white" onClick={()=>setShowPoseForm(true)}>
                Poser ces jours ({selectedDays.length})
              </button>
            </div>
          )}
          {/* Formulaire poser jours */}
          {showPoseForm && (
            <form onSubmit={handlePose} className="mt-4 bg-violet-50 dark:bg-violet-900 rounded-xl p-4 flex flex-col gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Motif d'absence</label>
                <select value={motif} onChange={e=>setMotif(e.target.value)} className="form-select w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  {motifs.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="btn border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200" onClick={()=>setShowPoseForm(false)}>Annuler</button>
                <button type="submit" className="btn bg-violet-600 hover:bg-violet-700 text-white">Valider ({selectedDays.length} jour(s))</button>
              </div>
            </form>
          )}
        </div>

        {/* Section compteurs + suivi personnel */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mini tableaux de bord */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-violet-50 dark:bg-violet-900 p-4 flex flex-col items-center shadow">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Congés restants</div>
                <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">{daysLeft}</div>
                <div className="text-xs text-gray-400 mt-1">jours</div>
              </div>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900 p-4 flex flex-col items-center shadow">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Jours posés</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{daysTaken}</div>
                <div className="text-xs text-gray-400 mt-1">jours</div>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900 p-4 flex flex-col items-center shadow">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">RTT</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{rtt}</div>
                <div className="text-xs text-gray-400 mt-1">jours</div>
              </div>
            </div>
          </div>
          {/* Suivi personnel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Suivi personnel</h3>
              <ul className="space-y-3">
                <li>
                  <button type="button" onClick={()=>setPersonalPanel(personalPanel==='recap'?null:'recap')} className="flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 font-medium w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4 4 4-4m-4-5v9"/></svg>
                    Récapitulatif annuel
                  </button>
                </li>
                <li>
                  <button type="button" onClick={()=>setPersonalPanel(personalPanel==='history'?null:'history')} className="flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 font-medium w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                    Historique des demandes
                  </button>
                </li>
                <li>
                  <button type="button" onClick={()=>setPersonalPanel(personalPanel==='actions'?null:'actions')} className="flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 font-medium w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    Dernières actions
                  </button>
                </li>
              </ul>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Cliquez sur un compteur pour voir le détail.<br/>Cliquez sur un jour férié pour afficher son nom.</p>
              {/* Panels interactifs */}
              {personalPanel==='recap' && (
                <div className="mt-6 bg-violet-50 dark:bg-violet-900 rounded-xl p-4 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={()=>setPersonalPanel(null)}>&times;</button>
                  <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">Récapitulatif {recapData.annee}</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    <li>Total jours posés : <span className="font-bold">{recapData.totalPoses}</span></li>
                    <li>Congés restants : <span className="font-bold">{recapData.totalRestants}</span></li>
                    <li>RTT : <span className="font-bold">{recapData.rtt}</span></li>
                  </ul>
                </div>
              )}
              {personalPanel==='history' && (
                <div className="mt-6 bg-violet-50 dark:bg-violet-900 rounded-xl p-4 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={()=>setPersonalPanel(null)}>&times;</button>
                  <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">Historique des demandes</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400">
                        <th className="text-left py-1">Date</th>
                        <th className="text-left py-1">Motif</th>
                        <th className="text-left py-1">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((h, i) => (
                        <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="py-1">{h.date}</td>
                          <td className="py-1">{h.motif}</td>
                          <td className="py-1">{h.statut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {personalPanel==='actions' && (
                <div className="mt-6 bg-violet-50 dark:bg-violet-900 rounded-xl p-4 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={()=>setPersonalPanel(null)}>&times;</button>
                  <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">Dernières actions</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    {actionsData.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CongesAbsences; 