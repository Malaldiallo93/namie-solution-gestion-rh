import React, { useState } from 'react';

function NotesFrais() {
  const [tab, setTab] = useState('statuts');
  const [showForm, setShowForm] = useState(false);
  const [depense, setDepense] = useState({ motif: '', montant: '', factures: [] });
  const [factureFiles, setFactureFiles] = useState([]);
  const [allDepenses, setAllDepenses] = useState([]);

  // Gestion des fichiers multiples
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setFactureFiles(prev => [...prev, ...files]);
  };

  // Ajout d'une dépense fictive avec statut initial
  const handleAddDepense = (e) => {
    e.preventDefault();
    const newDepense = {
      ...depense,
      factures: factureFiles,
      id: Date.now(),
      statut: 'en_attente',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      etapes: [
        { nom: 'Soumission', statut: 'termine', date: new Date().toLocaleDateString('fr-FR') },
        { nom: 'Validation Manager', statut: 'en_cours', date: null },
        { nom: 'Validation RH', statut: 'en_attente', date: null },
        { nom: 'Approuvée', statut: 'en_attente', date: null }
      ]
    };
    setAllDepenses(prev => [...prev, newDepense]);
    setDepense({ motif: '', montant: '', factures: [] });
    setFactureFiles([]);
    setShowForm(false);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'termine': return 'bg-green-500';
      case 'en_cours': return 'bg-blue-500';
      case 'en_attente': return 'bg-gray-300';
      case 'refuse': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (statut) => {
    switch(statut) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'refuse': return 'Refusé';
      default: return 'En attente';
    }
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Situation et notes de frais</h1>
          <button
            className="btn bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
            onClick={()=>setShowForm(true)}
          >
            Créer une nouvelle dépense
          </button>
        </div>
        {/* Onglets */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'statuts', label: 'Statuts' },
            { key: 'suivi', label: 'Suivi' },
          ].map(t => (
            <button
              key={t.key}
              onClick={()=>setTab(t.key)}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition focus:outline-none ${tab===t.key ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Bloc central - Formulaire ou état vide */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-8">
          {showForm ? (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nouvelle dépense</h2>
                <button 
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddDepense} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Motif</label>
                  <input 
                    type="text" 
                    required 
                    value={depense.motif} 
                    onChange={e=>setDepense({...depense, motif: e.target.value})} 
                    className="form-input w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200" 
                    placeholder="Motif de la dépense" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Montant (€)</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    required 
                    value={depense.montant} 
                    onChange={e=>setDepense({...depense, montant: e.target.value})} 
                    className="form-input w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200" 
                    placeholder="Montant" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Factures</label>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFilesChange} 
                    className="form-input w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200" 
                  />
                  {factureFiles.length > 0 && (
                    <ul className="text-xs text-gray-500 mt-2">
                      {factureFiles.map((f, i) => <li key={i}>{f.name || `Facture ${i+1}`}</li>)}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200" 
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[350px]">
              {/* Illustration fictive */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-4">
                  <svg width="56" height="56" fill="none" viewBox="0 0 56 56">
                    <rect x="8" y="16" width="40" height="28" rx="4" fill="#a5b4fc"/>
                    <rect x="16" y="24" width="24" height="12" rx="2" fill="#fff"/>
                    <path d="M20 30h8M20 34h16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Aucune note de frais</span>
              </div>
              {/* Message et actions */}
              <div className="flex-1 flex flex-col items-center md:items-start">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Vous n'avez pas encore créé de notes de frais</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Déposez vos justificatifs pour les importer automatiquement ou téléchargez des fichiers depuis votre ordinateur.</p>
                <div className="flex gap-2 mb-2">
                  <label className="btn bg-violet-600 hover:bg-violet-700 text-white cursor-pointer">
                    Choisir un fichier
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline text-sm">Consulter la politique de frais</a>
              </div>
            </div>
          )}
        </div>
        {/* Liste des dépenses fictives ajoutées */}
        {allDepenses.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {tab === 'suivi' ? 'Suivi des dépenses' : 'Mes dépenses'}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {allDepenses.map((d, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-200 text-lg">{d.motif}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{d.montant} € • {d.dateCreation}</div>
                      <div className="text-xs text-gray-400 mt-1">{d.factures.length} facture(s) ajoutée(s)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(d.statut)} text-white`}>
                        {getStatusText(d.statut)}
                      </span>
                    </div>
                  </div>
                  
                  {tab === 'suivi' && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Progression</div>
                      <div className="flex items-center gap-4">
                        {d.etapes.map((etape, etapeIdx) => (
                          <div key={etapeIdx} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              etape.statut === 'termine' ? 'bg-green-500 text-white' :
                              etape.statut === 'en_cours' ? 'bg-blue-500 text-white' :
                              'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            }`}>
                              {etape.statut === 'termine' ? '✓' : etapeIdx + 1}
                            </div>
                            <div className="ml-2">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-200">{etape.nom}</div>
                              {etape.date && (
                                <div className="text-xs text-gray-500">{etape.date}</div>
                              )}
                            </div>
                            {etapeIdx < d.etapes.length - 1 && (
                              <div className={`w-8 h-0.5 ml-2 ${
                                etape.statut === 'termine' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                              }`}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tab === 'statuts' && (
                    <ul className="text-xs text-gray-400 mt-2">
                      {d.factures.map((f, i) => <li key={i}>{f.name || `Facture ${i+1}`}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default NotesFrais; 