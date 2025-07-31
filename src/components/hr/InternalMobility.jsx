import React from 'react';

const mockOffers = [
  {
    id: 1,
    poste: 'Tech Lead',
    departement: 'IT',
    localisation: 'Paris',
    type: 'Temps plein',
    description: 'Gérer une équipe de développeurs et définir l\'architecture technique',
    competencesRequises: ['React', 'Node.js', 'Leadership'],
    candidats: 3,
    statut: 'Ouverte'
  },
  {
    id: 2,
    poste: 'Chef de Projet Senior',
    departement: 'Marketing',
    localisation: 'Lyon',
    type: 'Temps plein',
    description: 'Gérer des projets marketing complexes et diriger une équipe',
    competencesRequises: ['Gestion de projet', 'Marketing digital', 'Agile'],
    candidats: 1,
    statut: 'Ouverte'
  }
];

const mockCandidatures = [
  {
    id: 1,
    employe: 'Marie Dubois',
    poste: 'Tech Lead',
    date: '2024-01-10',
    statut: 'En cours',
    progression: 75
  },
  {
    id: 2,
    employe: 'Thomas Martin',
    poste: 'Chef de Projet Senior',
    date: '2024-01-15',
    statut: 'Acceptée',
    progression: 100
  }
];

const mockAlertes = [
  {
    id: 1,
    employe: 'Marie Dubois',
    poste: 'Directeur Technique',
    raison: 'Compétences techniques élevées + expérience leadership',
    date: '2024-01-20'
  },
  {
    id: 2,
    employe: 'Sophie Bernard',
    poste: 'UX Lead',
    raison: 'Profil UX/UI + expérience en gestion d\'équipe',
    date: '2024-01-18'
  }
];

function InternalMobility() {
  return (
    <div className="space-y-6">
      {/* Offres internes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Offres internes consultables</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockOffers.map((offer) => (
            <div key={offer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{offer.poste}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{offer.departement} - {offer.localisation}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  offer.statut === 'Ouverte' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                }`}>
                  {offer.statut}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{offer.description}</p>
              
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Compétences requises:</h4>
                <div className="flex flex-wrap gap-1">
                  {offer.competencesRequises.map((comp, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">{offer.candidats} candidat(s)</span>
                <button className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                  Postuler
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidatures internes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Suivi des candidatures internes</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employé</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Poste</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Statut</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Progression</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockCandidatures.map((candidature) => (
                <tr key={candidature.id}>
                  <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{candidature.employe}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{candidature.poste}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{candidature.date}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      candidature.statut === 'Acceptée' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      candidature.statut === 'En cours' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {candidature.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full" 
                        style={{ width: `${candidature.progression}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{candidature.progression}%</span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Alertes - Postes correspondant aux aspirations</h2>
        
        <div className="space-y-3">
          {mockAlertes.map((alerte) => (
            <div key={alerte.id} className="border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">{alerte.employe}</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Poste suggéré: {alerte.poste}</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">{alerte.raison}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">{alerte.date}</span>
                  <div className="mt-2 space-x-2">
                    <button className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded">
                      Notifier
                    </button>
                    <button className="px-2 py-1 text-xs border border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800">
                      Ignorer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InternalMobility; 