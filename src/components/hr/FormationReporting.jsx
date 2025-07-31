import React from 'react';

const mockStats = {
  participation: 78,
  completion: 94,
  budgetUtilise: 45000,
  budgetPrevu: 60000,
  formationsParType: [
    { type: 'Soft Skills', count: 12, pourcentage: 40 },
    { type: 'Hard Skills', count: 8, pourcentage: 27 },
    { type: 'Management', count: 6, pourcentage: 20 },
    { type: 'Certifications', count: 4, pourcentage: 13 }
  ],
  formationsParMetier: [
    { metier: 'Développeurs', count: 15, pourcentage: 50 },
    { metier: 'Managers', count: 8, pourcentage: 27 },
    { metier: 'Data Analysts', count: 4, pourcentage: 13 },
    { metier: 'DevOps', count: 3, pourcentage: 10 }
  ],
  roiFormations: [
    {
      formation: 'React Avancé',
      avant: 65,
      apres: 85,
      amelioration: '+20%',
      impact: 'Élevé'
    },
    {
      formation: 'Leadership et Management',
      avant: 70,
      apres: 82,
      amelioration: '+12%',
      impact: 'Moyen'
    },
    {
      formation: 'AWS Certification',
      avant: 45,
      apres: 78,
      amelioration: '+33%',
      impact: 'Élevé'
    }
  ]
};

function FormationReporting() {
  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de participation</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{mockStats.participation}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de complétion</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{mockStats.completion}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget utilisé</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{mockStats.budgetUtilise.toLocaleString()}€</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">sur {mockStats.budgetPrevu.toLocaleString()}€</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total formations</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des formations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Répartition par typologie</h2>
          
          <div className="space-y-3">
            {mockStats.formationsParType.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{
                    backgroundColor: idx === 0 ? '#8b5cf6' : idx === 1 ? '#3b82f6' : idx === 2 ? '#10b981' : '#f59e0b'
                  }}></div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.type}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.pourcentage}%`,
                        backgroundColor: idx === 0 ? '#8b5cf6' : idx === 1 ? '#3b82f6' : idx === 2 ? '#10b981' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} ({item.pourcentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Répartition par métier</h2>
          
          <div className="space-y-3">
            {mockStats.formationsParMetier.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{
                    backgroundColor: idx === 0 ? '#ef4444' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#06b6d4' : '#84cc16'
                  }}></div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.metier}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.pourcentage}%`,
                        backgroundColor: idx === 0 ? '#ef4444' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#06b6d4' : '#84cc16'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} ({item.pourcentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analyse ROI */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Analyse ROI des formations</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Formation</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Après</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amélioration</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockStats.roiFormations.map((roi, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{roi.formation}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{roi.avant}%</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{roi.apres}%</td>
                  <td className="px-4 py-2">
                    <span className="text-green-600 dark:text-green-400 font-medium">{roi.amelioration}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      roi.impact === 'Élevé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {roi.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphique de progression du budget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Suivi du budget formation</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Budget utilisé vs prévu</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {Math.round((mockStats.budgetUtilise / mockStats.budgetPrevu) * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className="bg-violet-600 h-4 rounded-full" 
              style={{ width: `${(mockStats.budgetUtilise / mockStats.budgetPrevu) * 100}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Utilisé:</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{mockStats.budgetUtilise.toLocaleString()}€</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Prévu:</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{mockStats.budgetPrevu.toLocaleString()}€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormationReporting; 