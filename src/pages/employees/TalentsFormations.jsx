import React, { useState } from 'react';
import SkillsMapping from '../../components/hr/SkillsMapping';
import PerformanceReview from '../../components/hr/PerformanceReview';
import InternalMobility from '../../components/hr/InternalMobility';
import FormationCatalog from '../../components/hr/FormationCatalog';
import FormationManagement from '../../components/hr/FormationManagement';
import IndividualTracking from '../../components/hr/IndividualTracking';
import FormationReporting from '../../components/hr/FormationReporting';

function TalentsFormations() {
  const [activeTab, setActiveTab] = useState('talents');
  const [activeFormationTab, setActiveFormationTab] = useState('catalog');

  // Données fictives pour les talents
  const talents = [
    { id: 1, nom: 'Marie Dubois', poste: 'Développeuse Senior', competences: ['React', 'Node.js', 'TypeScript'], niveau: 'Expert', potentiel: 'Élevé' },
    { id: 2, nom: 'Thomas Martin', poste: 'Chef de Projet', competences: ['Agile', 'Scrum', 'Gestion d\'équipe'], niveau: 'Intermédiaire', potentiel: 'Moyen' },
    { id: 3, nom: 'Sophie Bernard', poste: 'UX Designer', competences: ['Figma', 'Adobe XD', 'Prototypage'], niveau: 'Expert', potentiel: 'Élevé' },
    { id: 4, nom: 'Lucas Petit', poste: 'Data Analyst', competences: ['Python', 'SQL', 'Tableau'], niveau: 'Débutant', potentiel: 'Élevé' },
  ];

  // Données fictives pour les formations
  const formations = [
    { id: 1, titre: 'Formation React Avancé', formateur: 'Tech Academy', duree: '3 jours', niveau: 'Intermédiaire', places: 12, inscrits: 8 },
    { id: 2, titre: 'Leadership et Management', formateur: 'Leadership Pro', duree: '2 jours', niveau: 'Tous niveaux', places: 15, inscrits: 12 },
    { id: 3, titre: 'Data Science Fundamentals', formateur: 'Data Institute', duree: '5 jours', niveau: 'Débutant', places: 10, inscrits: 6 },
    { id: 4, titre: 'Communication Interculturelle', formateur: 'Global Skills', duree: '1 jour', niveau: 'Tous niveaux', places: 20, inscrits: 18 },
  ];

  // Données fictives pour les compétences
  const competences = [
    { nom: 'Développement Frontend', niveau: 85, employes: 12 },
    { nom: 'Gestion de Projet', niveau: 72, employes: 8 },
    { nom: 'Data Analysis', niveau: 68, employes: 6 },
    { nom: 'Design UX/UI', niveau: 91, employes: 4 },
    { nom: 'Communication', niveau: 78, employes: 15 },
  ];

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Talents et Formations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos talents et développez les compétences de votre équipe
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { key: 'talents', label: 'Gestion des Talents' },
            { key: 'skills', label: 'Cartographie Compétences' },
            { key: 'performance', label: 'Évaluation Performance' },
            { key: 'mobility', label: 'Mobilité Interne' },
            { key: 'formations', label: 'Formations' },
            { key: 'competences', label: 'Compétences' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition focus:outline-none whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'talents' && (
          <div className="space-y-6">
            {/* Cartographie des compétences */}
            <SkillsMapping />
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Talents</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Potentiel Élevé</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Formation</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Évaluations</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">18</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des talents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nos Talents</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Compétences</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Niveau</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Potentiel</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {talents.map((talent) => (
                      <tr key={talent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{talent.nom}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{talent.poste}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {talent.competences.map((comp, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            talent.niveau === 'Expert' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            talent.niveau === 'Intermédiaire' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {talent.niveau}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            talent.potentiel === 'Élevé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}>
                            {talent.potentiel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillsMapping />
        )}

        {activeTab === 'performance' && (
          <PerformanceReview />
        )}

        {activeTab === 'mobility' && (
          <InternalMobility />
        )}

        {activeTab === 'formations' && (
          <div className="space-y-6">
            {/* Sous-onglets pour les formations */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {[
                { key: 'catalog', label: 'Catalogue' },
                { key: 'management', label: 'Gestion' },
                { key: 'tracking', label: 'Suivi Individuel' },
                { key: 'reporting', label: 'Reporting' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFormationTab(tab.key)}
                  className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition focus:outline-none whitespace-nowrap ${
                    activeFormationTab === tab.key 
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeFormationTab === 'catalog' && (
              <FormationCatalog />
            )}

            {activeFormationTab === 'management' && (
              <FormationManagement />
            )}

            {activeFormationTab === 'tracking' && (
              <IndividualTracking />
            )}

            {activeFormationTab === 'reporting' && (
              <FormationReporting />
            )}
          </div>
        )}

        {activeTab === 'competences' && (
          <div className="space-y-6">
            {/* Graphique des compétences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Répartition des Compétences</h2>
              <div className="space-y-4">
                {competences.map((comp, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-200">{comp.nom}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-violet-600 h-3 rounded-full" 
                          style={{ width: `${comp.niveau}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">{comp.niveau}%</div>
                    <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">{comp.employes} employés</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recommandations</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-blue-800 dark:text-blue-200">Formation "Leadership Avancé" recommandée pour 3 employés</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800 dark:text-green-200">5 employés ont terminé leur formation avec succès</span>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">Évaluation des compétences à planifier pour 8 employés</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TalentsFormations; 