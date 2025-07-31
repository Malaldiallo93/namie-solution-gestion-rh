import React, { useState } from 'react';

const mockFormations = [
  // Parcours internes
  {
    id: 1,
    titre: 'React Avancé',
    type: 'Interne',
    categorie: 'Technique',
    duree: '3 jours',
    niveau: 'Intermédiaire',
    public: 'Développeurs',
    formateur: 'Tech Academy',
    description: 'Maîtriser les concepts avancés de React et les bonnes pratiques',
    prix: 0,
    places: 12,
    inscrits: 8,
    statut: 'Ouverte'
  },
  {
    id: 2,
    titre: 'Leadership et Management',
    type: 'Interne',
    categorie: 'Soft Skills',
    duree: '2 jours',
    niveau: 'Tous niveaux',
    public: 'Managers',
    formateur: 'Leadership Pro',
    description: 'Développer ses compétences de leadership et de gestion d\'équipe',
    prix: 0,
    places: 15,
    inscrits: 12,
    statut: 'Ouverte'
  },
  {
    id: 3,
    titre: 'Communication Interculturelle',
    type: 'Interne',
    categorie: 'Soft Skills',
    duree: '1 jour',
    niveau: 'Tous niveaux',
    public: 'Tous',
    formateur: 'Global Skills',
    description: 'Améliorer sa communication dans un contexte international',
    prix: 0,
    places: 20,
    inscrits: 18,
    statut: 'Ouverte'
  },
  // Formations externes
  {
    id: 4,
    titre: 'AWS Certified Solutions Architect',
    type: 'Externe',
    categorie: 'Certification',
    duree: '5 jours',
    niveau: 'Avancé',
    public: 'DevOps',
    formateur: 'AWS Training',
    description: 'Préparation à la certification AWS Solutions Architect',
    prix: 2500,
    places: 8,
    inscrits: 3,
    statut: 'Ouverte'
  },
  {
    id: 5,
    titre: 'Data Science Fundamentals',
    type: 'Externe',
    categorie: 'MOOC',
    duree: '6 semaines',
    niveau: 'Débutant',
    public: 'Data Analysts',
    formateur: 'Coursera',
    description: 'Introduction aux concepts fondamentaux de la data science',
    prix: 500,
    places: 10,
    inscrits: 6,
    statut: 'Ouverte'
  }
];

const categories = ['Toutes', 'Technique', 'Soft Skills', 'Management', 'Certification', 'MOOC'];
const niveaux = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'];
const publics = ['Tous', 'Développeurs', 'Managers', 'DevOps', 'Data Analysts', 'Tous'];

function FormationCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes');
  const [selectedNiveau, setSelectedNiveau] = useState('Tous');
  const [selectedPublic, setSelectedPublic] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Toutes');

  const filteredFormations = mockFormations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = selectedCategorie === 'Toutes' || formation.categorie === selectedCategorie;
    const matchesNiveau = selectedNiveau === 'Tous' || formation.niveau === selectedNiveau;
    const matchesPublic = selectedPublic === 'Tous' || formation.public === selectedPublic;
    const matchesType = selectedType === 'Toutes' || formation.type === selectedType;
    
    return matchesSearch && matchesCategorie && matchesNiveau && matchesPublic && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Moteur de recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Catalogue de formations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Toutes">Toutes</option>
              <option value="Interne">Interne</option>
              <option value="Externe">Externe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catégorie</label>
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niveau</label>
            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {niveaux.map(niv => (
                <option key={niv} value={niv}>{niv}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public</label>
            <select
              value={selectedPublic}
              onChange={(e) => setSelectedPublic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {publics.map(pub => (
                <option key={pub} value={pub}>{pub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFormations.map((formation) => (
          <div key={formation.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{formation.titre}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      formation.type === 'Interne' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {formation.type}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                      {formation.categorie}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      formation.niveau === 'Débutant' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      formation.niveau === 'Intermédiaire' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {formation.niveau}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{formation.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Formateur:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formation.formateur}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Durée:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formation.duree}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Public:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formation.public}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Places:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formation.inscrits}/{formation.places}</span>
                </div>
                {formation.prix > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Prix:</span>
                    <span className="text-gray-800 dark:text-gray-200">{formation.prix}€</span>
                  </div>
                )}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-violet-600 h-2 rounded-full" 
                  style={{ width: `${(formation.inscrits / formation.places) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((formation.inscrits / formation.places) * 100)}% rempli
                </span>
                <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition duration-150">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormationCatalog; 