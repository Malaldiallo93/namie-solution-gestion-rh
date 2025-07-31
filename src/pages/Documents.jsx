import React, { useState, useRef } from 'react';

const CATEGORIES = [
  { key: 'medical', label: 'Médical' },
  { key: 'contrat', label: 'Contrat' },
  { key: 'paie', label: 'Paie' },
  { key: 'autres', label: 'Autres' },
];

function getCategoryFromNameOrType(name, type) {
  const n = name.toLowerCase();
  if (n.includes('médical') || n.includes('visite')) return 'medical';
  if (n.includes('contrat')) return 'contrat';
  if (n.includes('paie')) return 'paie';
  return 'autres';
}

const mockDocuments = [
  { id: 1, name: 'Visite médicale janvier.pdf', category: 'medical', type: 'pdf', date: '2024-06-01', url: '#' },
  { id: 2, name: 'Contrat CDI.pdf', category: 'contrat', type: 'pdf', date: '2023-12-15', url: '#' },
  { id: 3, name: 'Fiche de paie mai 2024.pdf', category: 'paie', type: 'pdf', date: '2024-06-05', url: '#' },
  { id: 4, name: 'Justificatif médical.jpg', category: 'medical', type: 'jpg', date: '2024-05-20', url: '#' },
  { id: 5, name: 'Attestation employeur.pdf', category: 'autres', type: 'pdf', date: '2024-04-10', url: '#' },
];

function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const fileInputRef = useRef();

  // Filtres combinés
  const filteredDocs = documents.filter(doc => {
    return (
      (categoryFilter === '' || doc.category === categoryFilter) &&
      (typeFilter === '' || doc.type === typeFilter) &&
      (dateFilter === '' || doc.date === dateFilter) &&
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Ajout de document (mock, accès direct à la source)
  const handleAdd = (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const category = getCategoryFromNameOrType(file.name, ext);
      const url = URL.createObjectURL(file); // accès direct à la source
      setDocuments([
        ...documents,
        {
          id: Date.now(),
          name: file.name,
          category,
          type: ext,
          date: new Date().toISOString().slice(0, 10),
          url,
        },
      ]);
      fileInputRef.current.value = '';
    }
  };

  // Sélection
  const handleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Actions (mock)
  const handleDownload = (doc) => {
    window.open(doc.url, '_blank');
  };
  const handleRename = (doc) => {
    const newName = prompt('Nouveau nom du document :', doc.name);
    if (newName) {
      setDocuments(docs => docs.map(d => d.id === doc.id ? { ...d, name: newName } : d));
    }
  };
  const handleDelete = (doc) => {
    if (window.confirm('Supprimer ce document ?')) {
      setDocuments(docs => docs.filter(d => d.id !== doc.id));
    }
  };

  // Types de fichiers présents
  const fileTypes = Array.from(new Set(documents.map(d => d.type)));
  // Dates présentes (mock)
  const fileDates = Array.from(new Set(documents.map(d => d.date)));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Documents personnels</h1>
      {/* Formulaire d'ajout en haut, intégré, sans fond noir */}
      <form onSubmit={handleAdd} className="bg-white border rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Ajouter un document</label>
          <input ref={fileInputRef} type="file" name="file" className="block w-full text-sm text-gray-700" required />
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-violet-500 text-white font-medium hover:bg-violet-600">Ajouter</button>
      </form>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        {/* Filtres catégories */}
        <div className="flex flex-wrap gap-2">
          <span className="font-medium text-gray-700 mr-2">Catégories :</span>
          <button onClick={() => setCategoryFilter('')} className={`px-3 py-1 rounded-full text-sm ${categoryFilter === '' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700'}`}>Toutes</button>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setCategoryFilter(cat.key)} className={`px-3 py-1 rounded-full text-sm ${categoryFilter === cat.key ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{cat.label}</button>
          ))}
        </div>
        {/* Filtres avancés */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Rechercher un document..."
            className="border border-gray-200 rounded px-3 py-1 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-violet-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="border rounded px-2 py-1 text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Type</option>
            {fileTypes.map(type => <option key={type} value={type}>{type.toUpperCase()}</option>)}
          </select>
          <select className="border rounded px-2 py-1 text-sm" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="">Date</option>
            {fileDates.map(date => <option key={date} value={date}>{date}</option>)}
          </select>
        </div>
      </div>
      {/* Liste des documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {filteredDocs.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">Aucun document trouvé.</div>
        )}
        {filteredDocs.map(doc => (
          <div key={doc.id} className="border rounded-lg p-4 flex flex-col items-center bg-white relative shadow-sm">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M14 12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V12z" stroke="#6B7280" strokeWidth="1.5"/><path d="M18 16h4M18 20h4M18 24h4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="block text-xs text-gray-700 truncate w-full text-center mb-1 font-medium">{doc.name}</span>
            <span className="text-xs text-gray-400 mb-1">{CATEGORIES.find(c => c.key === doc.category)?.label || 'Autre'}</span>
            <span className="text-xs text-gray-400 mb-2">{doc.date}</span>
            <input type="checkbox" className="absolute top-2 right-2" checked={selected.includes(doc.id)} onChange={() => handleSelect(doc.id)} />
            <div className="flex gap-2 mt-2">
              <button title="Voir / Télécharger" onClick={() => handleDownload(doc)} className="p-1 rounded hover:bg-gray-100 text-violet-600 font-medium underline">Voir / Télécharger</button>
              <button title="Renommer" onClick={() => handleRename(doc)} className="p-1 rounded hover:bg-gray-100"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M4 13.5V16h2.5l7.06-7.06a1.5 1.5 0 0 0-2.12-2.12L4 13.5z" stroke="#6B7280" strokeWidth="1.5"/><path d="M12.5 6.5l1 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
              <button title="Supprimer" onClick={() => handleDelete(doc)} className="p-1 rounded hover:bg-gray-100"><svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="5" y="7" width="10" height="8" rx="2" stroke="#EF4444" strokeWidth="1.5"/><path d="M8 9v4M12 9v4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="4" width="6" height="2" rx="1" fill="#E5E7EB"/></svg></button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination (placeholder) */}
      <div className="flex justify-end items-center gap-2">
        <button className="p-1.5 rounded border border-gray-200 text-gray-400" disabled>{'<'}</button>
        <span className="text-sm">Page 1</span>
        <button className="p-1.5 rounded border border-gray-200 text-gray-400" disabled>{'>'}</button>
      </div>
    </div>
  );
}

export default Documents; 