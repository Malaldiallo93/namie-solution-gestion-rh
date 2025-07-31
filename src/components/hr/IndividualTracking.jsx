import React, { useState } from 'react';

const mockHistorique = [
  {
    id: 1,
    formation: 'React Avancé',
    date: '2024-01-15',
    statut: 'Terminée',
    note: 4.2,
    certificat: 'disponible',
    competences: ['React Hooks', 'Context API', 'Performance'],
    autoEvaluation: {
      satisfaction: 4,
      utilite: 5,
      commentaire: 'Formation très utile pour mon développement quotidien'
    }
  },
  {
    id: 2,
    formation: 'Leadership et Management',
    date: '2023-11-20',
    statut: 'Terminée',
    note: 3.8,
    certificat: 'disponible',
    competences: ['Gestion d\'équipe', 'Communication', 'Motivation'],
    autoEvaluation: {
      satisfaction: 4,
      utilite: 4,
      commentaire: 'Bons outils pour la gestion d\'équipe'
    }
  },
  {
    id: 3,
    formation: 'AWS Certified Solutions Architect',
    date: '2024-02-01',
    statut: 'En cours',
    note: null,
    certificat: 'non_disponible',
    competences: ['AWS Services', 'Architecture Cloud'],
    autoEvaluation: null
  }
];

const mockCompetences = [
  { nom: 'React', niveau: 85, progression: '+15%' },
  { nom: 'Leadership', niveau: 72, progression: '+8%' },
  { nom: 'AWS', niveau: 45, progression: '+25%' },
  { nom: 'Communication', niveau: 78, progression: '+5%' }
];

function IndividualTracking() {
  const [activeTab, setActiveTab] = useState('historique');

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'historique', label: 'Historique des Formations' },
          { key: 'certificats', label: 'Certificats & Badges' },
          { key: 'competences', label: 'Compétences Acquises' }
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

      {activeTab === 'historique' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Historique des formations suivies</h2>
            
            <div className="space-y-4">
              {mockHistorique.map((formation) => (
                <div key={formation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{formation.formation}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{formation.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formation.statut === 'Terminée' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {formation.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Compétences acquises</h4>
                      <div className="flex flex-wrap gap-1">
                        {formation.competences.map((comp, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Évaluation</h4>
                      {formation.note ? (
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{formation.note}/5</span>
                          <div className="ml-2 flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(formation.note) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">En cours</span>
                      )}
                    </div>
                  </div>
                  
                  {formation.autoEvaluation && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Auto-évaluation post-formation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Satisfaction:</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formation.autoEvaluation.satisfaction}/5</span>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < formation.autoEvaluation.satisfaction ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Utilité:</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formation.autoEvaluation.utilite}/5</span>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < formation.autoEvaluation.utilite ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Commentaire:</span>
                          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{formation.autoEvaluation.commentaire}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {formation.certificat === 'disponible' ? (
                        <button className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg">
                          Télécharger certificat
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Certificat non disponible</span>
                      )}
                    </div>
                    <button className="px-3 py-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certificats' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Certificats & Badges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockHistorique.filter(f => f.certificat === 'disponible').map((formation) => (
                <div key={formation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{formation.formation}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{formation.date}</p>
                  <button className="w-full px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium">
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'competences' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Suivi des compétences acquises</h2>
            
            <div className="space-y-4">
              {mockCompetences.map((competence, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{competence.nom}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{competence.progression}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className="bg-violet-600 h-3 rounded-full" 
                      style={{ width: `${competence.niveau}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Niveau actuel</span>
                    <span className="text-gray-800 dark:text-gray-200">{competence.niveau}%</span>
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

export default IndividualTracking; 