import React from 'react';

const mockReviews = [
  {
    id: 1,
    employe: 'Marie Dubois',
    type: 'Entretien annuel',
    date: '2024-01-15',
    statut: 'Terminé',
    evaluateur: 'Jean Martin',
    note: 4.2,
    objectifs: [
      { nom: 'Maîtriser GraphQL', progression: 80, statut: 'En cours' },
      { nom: 'Mentorer 2 juniors', progression: 100, statut: 'Terminé' }
    ],
    feedback360: {
      collegues: 4.5,
      manager: 4.2,
      autoEvaluation: 4.0
    }
  },
  {
    id: 2,
    employe: 'Thomas Martin',
    type: 'Entretien semestriel',
    date: '2024-07-20',
    statut: 'Planifié',
    evaluateur: 'Sophie Bernard',
    note: null,
    objectifs: [
      { nom: 'Gérer équipe de 10 personnes', progression: 60, statut: 'En cours' },
      { nom: 'Maîtriser l\'anglais', progression: 40, statut: 'En cours' }
    ],
    feedback360: null
  }
];

function PerformanceReview() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Évaluation des performances</h2>
      
      {mockReviews.map((review) => (
        <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{review.employe}</h3>
              <p className="text-gray-600 dark:text-gray-400">{review.type} - {review.date}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                review.statut === 'Terminé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
                {review.statut}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informations générales */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Informations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Évaluateur:</span>
                  <span className="text-gray-800 dark:text-gray-200">{review.evaluateur}</span>
                </div>
                {review.note && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Note globale:</span>
                    <span className="text-gray-800 dark:text-gray-200">{review.note}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Évaluation 360° */}
            {review.feedback360 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Évaluation 360°</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Collègues:</span>
                    <span className="text-gray-800 dark:text-gray-200">{review.feedback360.collegues}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Manager:</span>
                    <span className="text-gray-800 dark:text-gray-200">{review.feedback360.manager}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Auto-évaluation:</span>
                    <span className="text-gray-800 dark:text-gray-200">{review.feedback360.autoEvaluation}/5</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suivi des objectifs */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Suivi des objectifs</h4>
            <div className="space-y-3">
              {review.objectifs.map((objectif, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{objectif.nom}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      objectif.statut === 'Terminé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {objectif.statut}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-violet-600 h-2 rounded-full" 
                      style={{ width: `${objectif.progression}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {objectif.progression}% complété
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end space-x-2">
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
  );
}

export default PerformanceReview; 