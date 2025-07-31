import React, { useState, useEffect } from 'react';

function Presence() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [todayEntries, setTodayEntries] = useState([
    { entry: '08:00:00', exit: '12:00:00', total: '4h 00m' },
    { entry: '13:00:00', exit: null, total: '0h 00m' }
  ]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: '01/07/2025',
    end: '31/07/2025'
  });

  // Données simulées pour l'historique - étendues sur plusieurs mois
  const [presenceHistory] = useState([
    // Juillet 2025
    {
      date: '01/07/2025',
      day: 'Mar.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:01:02',
      exit: '18:01:22',
      breaks: '2h 54m',
      theoretical: '8h',
      total: '7h 05m',
      difference: '-0h 54m',
      uncategorized: '0h',
      adjustment: '0h',
      status: 'late'
    },
    {
      date: '02/07/2025',
      day: 'Mer.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:56:27',
      exit: '18:16:45',
      breaks: '0h 26m',
      theoretical: '8h',
      total: '8h 53m',
      difference: '+0h 53m',
      uncategorized: '0h',
      adjustment: '0h 53m',
      status: 'late'
    },
    {
      date: '03/07/2025',
      day: 'Jeu.',
      schedule: 'Lundi-vendredi 40H',
      entry: '07:47:03',
      exit: '17:16:18',
      breaks: '1h 18m',
      theoretical: '8h',
      total: '8h 11m',
      difference: '+0h 11m',
      uncategorized: '0h',
      adjustment: '0h 11m',
      status: 'normal'
    },
    // Août 2025
    {
      date: '01/08/2025',
      day: 'Ven.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:15:30',
      exit: '17:45:12',
      breaks: '1h 30m',
      theoretical: '8h',
      total: '7h 59m',
      difference: '-0h 01m',
      uncategorized: '0h',
      adjustment: '0h',
      status: 'normal'
    },
    {
      date: '04/08/2025',
      day: 'Lun.',
      schedule: 'Lundi-vendredi 40H',
      entry: '07:55:00',
      exit: '18:05:00',
      breaks: '1h 00m',
      theoretical: '8h',
      total: '9h 10m',
      difference: '+1h 10m',
      uncategorized: '0h',
      adjustment: '1h 10m',
      status: 'normal'
    },
    // Septembre 2025
    {
      date: '01/09/2025',
      day: 'Lun.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:30:15',
      exit: '17:30:45',
      breaks: '1h 00m',
      theoretical: '8h',
      total: '8h 00m',
      difference: '0h 00m',
      uncategorized: '0h',
      adjustment: '0h',
      status: 'normal'
    },
    {
      date: '02/09/2025',
      day: 'Mar.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:45:20',
      exit: '18:15:30',
      breaks: '1h 15m',
      theoretical: '8h',
      total: '8h 15m',
      difference: '+0h 15m',
      uncategorized: '0h',
      adjustment: '0h 15m',
      status: 'late'
    },
    // Octobre 2025
    {
      date: '01/10/2025',
      day: 'Mer.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:00:00',
      exit: '17:00:00',
      breaks: '1h 00m',
      theoretical: '8h',
      total: '8h 00m',
      difference: '0h 00m',
      uncategorized: '0h',
      adjustment: '0h',
      status: 'normal'
    },
    // Novembre 2025
    {
      date: '03/11/2025',
      day: 'Lun.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:10:30',
      exit: '17:40:15',
      breaks: '1h 20m',
      theoretical: '8h',
      total: '8h 09m',
      difference: '+0h 09m',
      uncategorized: '0h',
      adjustment: '0h 09m',
      status: 'normal'
    },
    // Décembre 2025
    {
      date: '01/12/2025',
      day: 'Lun.',
      schedule: 'Lundi-vendredi 40H',
      entry: '08:05:45',
      exit: '17:35:20',
      breaks: '1h 10m',
      theoretical: '8h',
      total: '8h 19m',
      difference: '+0h 19m',
      uncategorized: '0h',
      adjustment: '0h 19m',
      status: 'normal'
    }
  ]);

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calcul du temps travaillé aujourd'hui
  const calculateTodayTotal = () => {
    let totalMinutes = 0;
    todayEntries.forEach(entry => {
      if (entry.exit) {
        const entryTime = new Date(`2025-07-07 ${entry.entry}`);
        const exitTime = new Date(`2025-07-07 ${entry.exit}`);
        const diffMs = exitTime - entryTime;
        totalMinutes += Math.floor(diffMs / (1000 * 60));
      } else if (isWorking) {
        const entryTime = new Date(`2025-07-07 ${entry.entry}`);
        const now = new Date();
        const currentEntryTime = new Date(`2025-07-07 ${entry.entry}`);
        const diffMs = now - currentEntryTime;
        totalMinutes += Math.floor(diffMs / (1000 * 60));
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Fonctions de navigation du calendrier
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'next') {
        newMonth.setMonth(newMonth.getMonth() + 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() - 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    return {
      year,
      month,
      firstDay,
      lastDay,
      daysInMonth: lastDay.getDate(),
      startDate: firstDay.toLocaleDateString('fr-FR'),
      endDate: lastDay.toLocaleDateString('fr-FR')
    };
  };

  // Filtrer les données selon le mois sélectionné
  const filteredHistory = presenceHistory.filter(record => {
    const recordDate = new Date(record.date.split('/').reverse().join('-'));
    const monthData = getMonthData(currentMonth);
    return recordDate.getMonth() === monthData.month && recordDate.getFullYear() === monthData.year;
  });

  const handleStartWork = () => {
    setIsWorking(true);
    const newEntry = {
      entry: formatTime(currentTime),
      exit: null,
      total: '0h 00m'
    };
    setTodayEntries(prev => [...prev, newEntry]);
  };

  const handleStopWork = () => {
    setIsWorking(false);
    setTodayEntries(prev => {
      const updated = [...prev];
      const lastEntry = updated[updated.length - 1];
      if (lastEntry && !lastEntry.exit) {
        lastEntry.exit = formatTime(currentTime);
        const entryTime = new Date(`2025-07-07 ${lastEntry.entry}`);
        const exitTime = new Date(`2025-07-07 ${lastEntry.exit}`);
        const diffMs = exitTime - entryTime;
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        lastEntry.total = `${hours}h ${mins.toString().padStart(2, '0')}m`;
      }
      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section: Votre journée aujourd'hui */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Votre journée aujourd'hui</h1>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Sortir
          </button>
        </div>
        
        <div className="p-6">
          {/* Cartes d'information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Horaires</p>
                <p className="font-semibold text-gray-800">Lundi-vendredi 40H</p>
                <p className="text-sm text-gray-500">08:00h à 17:00h</p>
              </div>
            </div>
            

            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-600">Heures</p>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Aujourd'hui</p>
                <p className="text-lg font-bold text-purple-600">{calculateTodayTotal()}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des entrées/sorties */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Entrées et sorties d'aujourd'hui</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-600">Entrée</th>
                    <th className="text-left py-2 font-medium text-gray-600">Sortie</th>
                    <th className="text-left py-2 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {todayEntries.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-800">{entry.entry}</td>
                      <td className="py-2 text-gray-800">{entry.exit || '-'}</td>
                      <td className="py-2 text-gray-800">{entry.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timer en temps réel et boutons d'action */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-4">
              {!isWorking ? (
                <button 
                  onClick={handleStartWork}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Commencer le travail</span>
                </button>
              ) : (
                <button 
                  onClick={handleStopWork}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12"/>
                  </svg>
                  <span>Arrêter le travail</span>
                </button>
              )}
            </div>
            
            {/* Timer en temps réel */}
            <div className="flex flex-col items-center">
              <div className="text-3xl font-mono text-gray-800 font-bold">
                {formatTime(currentTime)}
              </div>
              {isWorking && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  ⏱️ En cours de travail
                </div>
              )}
            </div>
            
            {/* Statut du pointage */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-700">
                Temps travaillé aujourd'hui
              </div>
              <div className="text-2xl font-mono text-purple-600 font-bold">
                {calculateTodayTotal()}
              </div>
            </div>
          </div>

          {/* Section données de présence */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
              Données de présence
            </summary>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Informations détaillées sur votre présence et vos horaires de travail.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* Section: Ma Présence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ma Présence</h2>
          
          {/* Onglets */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button 
              onClick={() => setSelectedTab('all')}
              className="pb-2 px-1 border-b-2 border-blue-500 text-blue-600"
            >
              Tous
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Contrôles de navigation du calendrier */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              {/* Sélecteur de mois/année */}
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-gray-800 capitalize">
                  {formatMonthYear(currentMonth)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Du</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={getMonthData(currentMonth).startDate}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 bg-gray-50"
                      readOnly
                    />
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  
                  <span className="text-sm text-gray-500">au</span>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={getMonthData(currentMonth).endDate}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 bg-gray-50"
                      readOnly
                    />
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Mois</option>
                <option>Trimestre</option>
                <option>Année</option>
              </select>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
                <span className="text-sm text-gray-600">{filteredHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Tableau d'historique */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 font-medium text-gray-600">Journée</th>
                  <th className="text-left py-3 font-medium text-gray-600">Entrée</th>
                  <th className="text-left py-3 font-medium text-gray-600">Sortie</th>
                  <th className="text-left py-3 font-medium text-gray-600">Pauses</th>
                  <th className="text-left py-3 font-medium text-gray-600">Horaires théoriques</th>
                  <th className="text-left py-3 font-medium text-gray-600">Total heures</th>
                  <th className="text-left py-3 font-medium text-gray-600">Différence</th>
                  <th className="text-left py-3 font-medium text-gray-600">Non catégorisées</th>
                  <th className="text-left py-3 font-medium text-gray-600">Ajustement système</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-gray-800">{record.day}</div>
                        <div className="text-xs text-gray-500">{record.date}</div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-800">{record.schedule}</td>
                    <td className={`py-3 ${record.status === 'late' ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
                      {record.entry}
                    </td>
                    <td className="py-3 text-gray-800">{record.exit}</td>
                    <td className="py-3 text-gray-800">{record.breaks}</td>
                    <td className="py-3 text-gray-800">{record.theoretical}</td>
                    <td className="py-3 text-gray-800">{record.total}</td>
                    <td className={`py-3 ${record.difference.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {record.difference}
                    </td>
                    <td className="py-3 text-gray-800">{record.uncategorized}</td>
                    <td className="py-3 text-gray-800">{record.adjustment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Presence; 