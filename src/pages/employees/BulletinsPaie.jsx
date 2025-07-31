import React, { useState } from 'react';

const fakePayslips = [
  { mois: 'Juin', annee: 2025, montant: 2450.32, statut: 'Disponible', url: '#' },
  { mois: 'Mai', annee: 2025, montant: 2450.32, statut: 'Disponible', url: '#' },
  { mois: 'Avril', annee: 2025, montant: 2450.32, statut: 'Disponible', url: '#' },
  { mois: 'Mars', annee: 2025, montant: 2450.32, statut: 'Téléchargé', url: '#' },
  { mois: 'Février', annee: 2025, montant: 2450.32, statut: 'Téléchargé', url: '#' },
  { mois: 'Janvier', annee: 2025, montant: 2450.32, statut: 'Téléchargé', url: '#' },
];

function BulletinsPaie() {
  const [payslips] = useState(fakePayslips);
  const totalBrut = payslips.reduce((acc, p) => acc + p.montant, 0);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Bulletins de paie</h1>
        {/* Résumé */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-violet-50 dark:bg-violet-900 p-4 flex flex-col items-center shadow">
            <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Nombre de bulletins</div>
            <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">{payslips.length}</div>
          </div>
          <div className="rounded-xl bg-green-50 dark:bg-green-900 p-4 flex flex-col items-center shadow">
            <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Total brut</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totalBrut.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
          </div>
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900 p-4 flex flex-col items-center shadow">
            <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Dernier bulletin</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{payslips[0].mois} {payslips[0].annee}</div>
          </div>
        </div>
        {/* Liste des bulletins */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Mes bulletins</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="text-left py-2">Mois</th>
                <th className="text-left py-2">Année</th>
                <th className="text-left py-2">Montant brut</th>
                <th className="text-left py-2">Statut</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((p, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900 transition">
                  <td className="py-2 font-medium text-gray-700 dark:text-gray-200">{p.mois}</td>
                  <td className="py-2">{p.annee}</td>
                  <td className="py-2">{p.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${p.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="py-2">
                    <button className="btn bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1 rounded" onClick={()=>alert('Téléchargement fictif !')}>Télécharger</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default BulletinsPaie; 