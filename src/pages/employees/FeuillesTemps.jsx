import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function FeuillesTemps() {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    status: 'draft'
  });
  const [entryFormData, setEntryFormData] = useState({
    date: '',
    hours: '',
    project: '',
    task: '',
    description: ''
  });

  // Données simulées
  useEffect(() => {
    const mockEmployees = [
      { id: 1, name: 'Alice Dubois', position: 'Développeur Senior' },
      { id: 2, name: 'Thomas Moreau', position: 'Développeur Full-Stack' },
      { id: 3, name: 'Emma Rousseau', position: 'Chef de Projet Marketing' },
      { id: 4, name: 'Lucas Petit', position: 'Responsable Communication' },
      { id: 5, name: 'Camille Leroy', position: 'Recruteuse' },
      { id: 6, name: 'Antoine Simon', position: 'Comptable' }
    ];

    const mockTimesheets = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'Alice Dubois',
        period: '2024-01',
        status: 'approved',
        totalHours: 168,
        entries: [
          { id: 1, date: '2024-01-01', hours: 8, project: 'Site Web', task: 'Développement Frontend', description: 'Création des composants React' },
          { id: 2, date: '2024-01-02', hours: 8, project: 'Site Web', task: 'Développement Frontend', description: 'Intégration API' },
          { id: 3, date: '2024-01-03', hours: 6, project: 'Site Web', task: 'Tests', description: 'Tests unitaires' },
          { id: 4, date: '2024-01-03', hours: 2, project: 'Réunion', task: 'Planning', description: 'Réunion équipe' }
        ]
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Thomas Moreau',
        period: '2024-01',
        status: 'pending',
        totalHours: 152,
        entries: [
          { id: 5, date: '2024-01-01', hours: 8, project: 'Application Mobile', task: 'Développement Backend', description: 'API REST' },
          { id: 6, date: '2024-01-02', hours: 8, project: 'Application Mobile', task: 'Développement Backend', description: 'Base de données' },
          { id: 7, date: '2024-01-03', hours: 8, project: 'Application Mobile', task: 'Développement Backend', description: 'Authentification' }
        ]
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Emma Rousseau',
        period: '2024-01',
        status: 'draft',
        totalHours: 120,
        entries: [
          { id: 8, date: '2024-01-01', hours: 6, project: 'Campagne Marketing', task: 'Stratégie', description: 'Planification Q1' },
          { id: 9, date: '2024-01-02', hours: 8, project: 'Campagne Marketing', task: 'Création', description: 'Contenu publicitaire' },
          { id: 10, date: '2024-01-03', hours: 6, project: 'Campagne Marketing', task: 'Analyse', description: 'Analyse concurrentielle' }
        ]
      }
    ];

    setEmployees(mockEmployees);
    setTimesheets(mockTimesheets);
  }, []);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600'
  };

  const statusLabels = {
    draft: 'Brouillon',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé'
  };

  const projects = [
    'Site Web',
    'Application Mobile',
    'Campagne Marketing',
    'Réunion',
    'Formation',
    'Maintenance',
    'Support Client'
  ];

  const tasks = [
    'Développement Frontend',
    'Développement Backend',
    'Tests',
    'Planning',
    'Stratégie',
    'Création',
    'Analyse',
    'Documentation',
    'Déploiement'
  ];

  const handleAddTimesheet = (e) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    const newTimesheet = {
      id: timesheets.length + 1,
      employeeId: parseInt(formData.employeeId),
      employeeName: employee.name,
      period: formData.period,
      status: formData.status,
      totalHours: 0,
      entries: []
    };
    setTimesheets([...timesheets, newTimesheet]);
    setFormData({ employeeId: '', period: '', status: 'draft' });
    setShowAddForm(false);
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...entryFormData,
      hours: parseFloat(entryFormData.hours)
    };
    
    const updatedTimesheet = {
      ...selectedTimesheet,
      entries: [...selectedTimesheet.entries, newEntry],
      totalHours: selectedTimesheet.totalHours + newEntry.hours
    };
    
    setTimesheets(timesheets.map(ts => 
      ts.id === selectedTimesheet.id ? updatedTimesheet : ts
    ));
    setSelectedTimesheet(updatedTimesheet);
    setEntryFormData({ date: '', hours: '', project: '', task: '', description: '' });
    setShowAddEntryForm(false);
  };

  const handleTimesheetClick = (timesheet) => {
    setSelectedTimesheet(timesheet);
    setShowAddEntryForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setTimesheets(timesheets.map(ts => 
      ts.id === id ? { ...ts, status: newStatus } : ts
    ));
    if (selectedTimesheet?.id === id) {
      setSelectedTimesheet({ ...selectedTimesheet, status: newStatus });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const getPeriodLabel = (period) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getEntriesByDate = (date) => {
    if (!selectedTimesheet) return [];
    const dateStr = date.toISOString().slice(0, 10);
    return selectedTimesheet.entries.filter(entry => entry.date === dateStr);
  };

  const getTotalHoursForDate = (date) => {
    const entries = getEntriesByDate(date);
    return entries.reduce((total, entry) => total + entry.hours, 0);
  };

  // Modifiers pour colorer les jours avec des entrées
  const modifiers = selectedTimesheet ? {
    hasEntries: selectedTimesheet.entries.map(entry => new Date(entry.date))
  } : {};

  const modifiersStyles = {
    hasEntries: {
      backgroundColor: '#8b5cf6',
      color: '#fff',
      borderRadius: '50%'
    }
  };

  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Feuilles de temps
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des feuilles de temps */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Feuilles de temps</h2>
              </header>
              <div className="p-3">
                <div className="space-y-2">
                  {timesheets.map(timesheet => (
                    <div
                      key={timesheet.id}
                      onClick={() => handleTimesheetClick(timesheet)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTimesheet?.id === timesheet.id
                          ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">{timesheet.employeeName}</h3>
                        <div className={`px-2 py-1 rounded text-xs ${statusColors[timesheet.status]}`}>
                          {statusLabels[timesheet.status]}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{getPeriodLabel(timesheet.period)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{timesheet.totalHours}h</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite : bouton + formulaire + détails */}
          <div className="lg:col-span-2">
            {/* Bouton et formulaire d'ajout en haut à droite */}
            <div className="flex flex-col items-end mb-6">
              <button
                className="btn bg-violet-500 hover:bg-violet-600 text-white mb-2"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="ml-2">Nouvelle feuille</span>
              </button>
              {showAddForm && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 w-full max-w-md mt-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Nouvelle feuille de temps</h3>
                  <form onSubmit={handleAddTimesheet} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Employé
                      </label>
                      <select
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                        className="form-select w-full focus:border-violet-500"
                        required
                      >
                        <option value="">Sélectionner un employé</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>{employee.name} - {employee.position}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Période (YYYY-MM)
                      </label>
                      <input
                        type="month"
                        value={formData.period}
                        onChange={e => setFormData({...formData, period: e.target.value})}
                        className="form-input w-full focus:border-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Statut initial
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="form-select w-full focus:border-violet-500"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="btn border-gray-200 hover:border-gray-300 text-gray-600 flex-1"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn bg-violet-500 hover:bg-violet-600 text-white flex-1"
                      >
                        Créer
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Détails de la feuille sélectionnée */}
            {selectedTimesheet ? (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                      {selectedTimesheet.employeeName} - {getPeriodLabel(selectedTimesheet.period)}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {selectedTimesheet.totalHours} heures
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTimesheet.status}
                      onChange={(e) => handleStatusChange(selectedTimesheet.id, e.target.value)}
                      className="form-select text-sm focus:border-violet-500"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <button
                      className="btn bg-violet-500 hover:bg-violet-600 text-white"
                      onClick={() => setShowAddEntryForm(!showAddEntryForm)}
                    >
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="ml-2">Ajouter entrée</span>
                    </button>
                  </div>
                </header>
                
                <div className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendrier */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Calendrier</h3>
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        locale="fr"
                        showOutsideDays
                        footer={
                          <div className="mt-2 text-sm text-gray-500">
                            Jours avec entrées: {selectedTimesheet.entries.length} jour(s)
                          </div>
                        }
                      />
                    </div>

                    {/* Entrées du jour sélectionné + formulaire à droite */}
                    <div className="flex flex-row gap-4 items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                          Entrées du {formatDate(selectedDate)}
                        </h3>
                        <div className="space-y-3">
                          {getEntriesByDate(selectedDate).map(entry => (
                            <div key={entry.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800 dark:text-gray-100">{entry.hours}h</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{entry.project}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{entry.task}</p>
                              {entry.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{entry.description}</p>
                              )}
                            </div>
                          ))}
                          {getEntriesByDate(selectedDate).length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                              Aucune entrée pour ce jour
                            </div>
                          )}
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              Total du jour: {getTotalHoursForDate(selectedDate)}h
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Formulaire d'ajout d'entrée à droite */}
                      {showAddEntryForm && (
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 w-full max-w-xs ml-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Nouvelle entrée - {selectedTimesheet.employeeName}
                          </h3>
                          <form onSubmit={handleAddEntry} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date
                              </label>
                              <input
                                type="date"
                                value={entryFormData.date}
                                onChange={e => setEntryFormData({...entryFormData, date: e.target.value})}
                                className="form-input w-full focus:border-violet-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Heures
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                value={entryFormData.hours}
                                onChange={e => setEntryFormData({...entryFormData, hours: e.target.value})}
                                className="form-input w-full focus:border-violet-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Projet
                              </label>
                              <select
                                value={entryFormData.project}
                                onChange={e => setEntryFormData({...entryFormData, project: e.target.value})}
                                className="form-select w-full focus:border-violet-500"
                                required
                              >
                                <option value="">Sélectionner un projet</option>
                                {projects.map(project => (
                                  <option key={project} value={project}>{project}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tâche
                              </label>
                              <select
                                value={entryFormData.task}
                                onChange={e => setEntryFormData({...entryFormData, task: e.target.value})}
                                className="form-select w-full focus:border-violet-500"
                                required
                              >
                                <option value="">Sélectionner une tâche</option>
                                {tasks.map(task => (
                                  <option key={task} value={task}>{task}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description (optionnel)
                              </label>
                              <textarea
                                value={entryFormData.description}
                                onChange={e => setEntryFormData({...entryFormData, description: e.target.value})}
                                className="form-textarea w-full focus:border-violet-500"
                                rows="2"
                                placeholder="Détails sur le travail effectué..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setShowAddEntryForm(false)}
                                className="btn border-gray-200 hover:border-gray-300 text-gray-600 flex-1"
                              >
                                Annuler
                              </button>
                              <button
                                type="submit"
                                className="btn bg-violet-500 hover:bg-violet-600 text-white flex-1"
                              >
                                Ajouter
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Liste complète des entrées */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Toutes les entrées</h3>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Date</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Heures</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Projet</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Tâche</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Description</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                          {selectedTimesheet.entries.map(entry => (
                            <tr key={entry.id}>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{formatDate(entry.date)}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="font-medium text-gray-800 dark:text-gray-100">{entry.hours}h</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{entry.project}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{entry.task}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{entry.description}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Sélectionnez une feuille de temps pour voir les détails</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FeuillesTemps; 