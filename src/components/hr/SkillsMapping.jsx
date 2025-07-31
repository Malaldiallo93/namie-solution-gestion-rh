import React from 'react';

const mockData = [
  {
    nom: 'Marie Dubois',
    poste: 'Développeuse Senior',
    departement: 'IT',
    competences: ['React', 'Node.js', 'TypeScript'],
    competencesRequises: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
  },
  {
    nom: 'Thomas Martin',
    poste: 'Chef de Projet',
    departement: 'Marketing',
    competences: ['Agile', 'Scrum', 'Gestion d\'équipe'],
    competencesRequises: ['Agile', 'Scrum', 'Gestion d\'équipe', 'Anglais'],
  },
];

function SkillsMapping() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Cartographie des compétences</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Collaborateur</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Poste</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Département</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Compétences actuelles</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Compétences requises</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Écart</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockData.map((collab, idx) => {
              const missing = collab.competencesRequises.filter(c => !collab.competences.includes(c));
              return (
                <tr key={idx}>
                  <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{collab.nom}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{collab.poste}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{collab.departement}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {collab.competences.map((c, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {collab.competencesRequises.map((c, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {missing.length === 0 ? (
                      <span className="text-green-600 dark:text-green-400 text-xs">Aucun écart</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {missing.map((c, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">{c}</span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">Compétences clés par poste/département</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">React (IT)</span>
          <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">Scrum (Marketing)</span>
          <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">Python (Data)</span>
        </div>
      </div>
    </div>
  );
}

export default SkillsMapping; 