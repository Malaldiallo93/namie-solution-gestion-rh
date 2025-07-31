import React, { useState } from 'react';

const mockSessions = [
  {
    id: 1,
    formation: 'React Avancé',
    date: '2024-02-15',
    heure: '09:00-17:00',
    lieu: 'Salle A - Paris',
    formateur: 'Jean Dupont',
    inscrits: 8,
    places: 12,
    statut: 'Confirmée',
    validations: [
      { employe: 'Marie Dubois', statut: 'Validée', manager: 'Thomas Martin' },
      { employe: 'Lucas Petit', statut: 'En attente', manager: 'Sophie Bernard' }
    ]
  },
  {
    id: 2,
    formation: 'Leadership et Management',
    date: '2024-02-20',
    heure: '09:00-17:00',
    lieu: 'Salle B - Lyon',
    formateur: 'Marie Laurent',
    inscrits: 12,
    places: 15,
    statut: 'Confirmée',
    validations: [
      { employe: 'Thomas Martin', statut: 'Validée', manager: 'Jean Martin' },
      { employe: 'Emma Leroy', statut: 'Validée', manager: 'Pierre Durand' }
    ]
  },
  {
    id: 3,
    formation: 'AWS Certified Solutions Architect',
    date: '2024-03-01',
    heure: '09:00-17:00',
    lieu: 'En ligne',
    formateur: 'AWS Training',
    inscrits: 3,
    places: 8,
    statut: 'En attente',
    validations: [
      { employe: 'Alexandre Moreau', statut: 'En attente', manager: 'Thomas Martin' }
    ]
  }
];

const mockNotifications = [
  {
    id: 1,
    type: 'Rappel',
    message: 'Formation React Avancé dans 2 jours',
    date: '2024-02-13',
    statut: 'Non lue'
  },
  {
    id: 2,
    type: 'Confirmation',
    message: 'Inscription validée pour Leadership et Management',
    date: '2024-02-10',
    statut: 'Lue'
  },
  {
    id: 3,
    type: 'Relance',
    message: 'Demande de validation pour AWS Certification',
    date: '2024-02-08',
    statut: 'Non lue'
  }
];

function FormationManagement() {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'planning', label: 'Planning des Sessions' },
          { key: 'inscriptions', label: 'Gestion Inscriptions' },
          { key: 'notifications', label: 'Notifications' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition focus:outline-none ${
              activeTab === tab.key 
                ? 'border-violet-500 text-violet-600 dark:text-violet-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Planning des sessions</h2>
            
            <div className="space-y-4">
              {mockSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{session.formation}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{session.date} - {session.heure}</p>
                      <p className="text-gray-600 dark:text-gray-400">{session.lieu}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.statut === 'Confirmée' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {session.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Formateur:</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{session.formateur}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Taux de remplissage:</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {Math.round((session.inscrits / session.places) * 100)}% ({session.inscrits}/{session.places})
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Places restantes:</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{session.places - session.inscrits}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-violet-600 h-2 rounded-full" 
                      style={{ width: `${(session.inscrits / session.places) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                      Voir détails
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inscriptions' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Gestion des inscriptions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employé</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Formation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Manager</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockSessions.flatMap(session => 
                    session.validations.map((validation, idx) => (
                      <tr key={`${session.id}-${idx}`}>
                        <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{validation.employe}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{session.formation}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{validation.manager}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            validation.statut === 'Validée' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {validation.statut}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            {validation.statut === 'En attente' && (
                              <>
                                <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                                  Valider
                                </button>
                                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                  Refuser
                                </button>
                              </>
                            )}
                            <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                              Détails
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Notifications</h2>
            
            <div className="space-y-3">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className={`border rounded-lg p-4 ${
                  notification.statut === 'Non lue' 
                    ? 'border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-900' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.type === 'Rappel' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          notification.type === 'Confirmation' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {notification.type}
                        </span>
                        {notification.statut === 'Non lue' && (
                          <span className="ml-2 w-2 h-2 bg-violet-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.date}</p>
                    </div>
                    <div className="ml-4">
                      <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                        Marquer comme lue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormationManagement; 