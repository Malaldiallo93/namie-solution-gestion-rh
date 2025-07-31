import React, { useState } from 'react';

function Announcements() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées des annonces
  const [announcements] = useState([
    {
      id: 1,
      title: 'Nouvelle politique de télétravail',
      content: 'À partir du 1er septembre 2025, la politique de télétravail sera étendue à 3 jours par semaine pour tous les employés éligibles. Cette mesure vise à améliorer l\'équilibre vie professionnelle/personnelle et réduire l\'empreinte carbone de l\'entreprise.',
      category: 'policy',
      priority: 'high',
      author: 'Direction RH',
      date: '15/07/2025',
      image: '🏢',
      tags: ['Télétravail', 'Politique', 'RH'],
      read: false,
      featured: true
    },
    {
      id: 2,
      title: 'Résultats trimestriels exceptionnels',
      content: 'Nous sommes fiers d\'annoncer que l\'entreprise a atteint ses objectifs trimestriels avec une croissance de 15% par rapport à l\'année précédente. Ces excellents résultats sont le fruit du travail de toute l\'équipe.',
      category: 'results',
      priority: 'high',
      author: 'Direction Générale',
      date: '12/07/2025',
      image: '📈',
      tags: ['Résultats', 'Performance', 'Équipe'],
      read: true,
      featured: true
    },
    {
      id: 3,
      title: 'Nouveaux équipements informatiques',
      content: 'Le service IT procédera au renouvellement des ordinateurs portables du département Marketing la semaine prochaine. Les nouveaux équipements offriront de meilleures performances et une meilleure sécurité.',
      category: 'it',
      priority: 'normal',
      author: 'Service IT',
      date: '10/07/2025',
      image: '💻',
      tags: ['IT', 'Équipement', 'Marketing'],
      read: false,
      featured: false
    },
    {
      id: 4,
      title: 'Formation obligatoire sur la cybersécurité',
      content: 'Une formation obligatoire sur la cybersécurité aura lieu le 25 juillet 2025. Tous les employés doivent y participer. Cette formation est essentielle pour protéger nos données et systèmes.',
      category: 'training',
      priority: 'high',
      author: 'Service IT',
      date: '08/07/2025',
      image: '🔒',
      tags: ['Formation', 'Cybersécurité', 'Obligatoire'],
      read: false,
      featured: false
    },
    {
      id: 5,
      title: 'Événement d\'été : Barbecue d\'entreprise',
      content: 'Venez célébrer l\'été avec vos collègues lors de notre traditionnel barbecue d\'entreprise ! L\'événement aura lieu le 30 juillet 2025 dans le parc de l\'entreprise. Inscriptions ouvertes jusqu\'au 20 juillet.',
      category: 'event',
      priority: 'normal',
      author: 'Comité d\'entreprise',
      date: '05/07/2025',
      image: '🍖',
      tags: ['Événement', 'Été', 'Convivialité'],
      read: true,
      featured: false
    },
    {
      id: 6,
      title: 'Nouvelle application mobile interne',
      content: 'Notre nouvelle application mobile "VAES Connect" est maintenant disponible ! Elle vous permettra d\'accéder à vos informations RH, demander des congés et rester connecté avec vos collègues.',
      category: 'it',
      priority: 'normal',
      author: 'Service IT',
      date: '03/07/2025',
      image: '📱',
      tags: ['Application', 'Mobile', 'Innovation'],
      read: false,
      featured: false
    },
    {
      id: 7,
      title: 'Changement d\'horaires pour les congés d\'été',
      content: 'Pendant la période estivale (juillet-août), les horaires de travail seront aménagés : 8h-16h au lieu de 9h-17h. Cette mesure s\'applique à tous les départements sauf le service client.',
      category: 'policy',
      priority: 'normal',
      author: 'Direction RH',
      date: '01/07/2025',
      image: '⏰',
      tags: ['Horaires', 'Été', 'Aménagement'],
      read: true,
      featured: false
    },
    {
      id: 8,
      title: 'Nouveau partenaire commercial',
      content: 'Nous sommes ravis d\'annoncer un nouveau partenariat avec TechCorp, leader dans le domaine des solutions digitales. Ce partenariat nous permettra d\'offrir de nouveaux services à nos clients.',
      category: 'business',
      priority: 'normal',
      author: 'Direction Commerciale',
      date: '28/06/2025',
      image: '🤝',
      tags: ['Partnership', 'Commercial', 'Innovation'],
      read: false,
      featured: false
    },
    {
      id: 9,
      title: 'Maintenance préventive des serveurs',
      content: 'Une maintenance préventive des serveurs est prévue le samedi 26 juillet 2025 de 2h à 6h du matin. Pendant cette période, certains services pourront être temporairement indisponibles.',
      category: 'it',
      priority: 'low',
      author: 'Service IT',
      date: '25/06/2025',
      image: '🔧',
      tags: ['Maintenance', 'Serveurs', 'IT'],
      read: true,
      featured: false
    },
    {
      id: 10,
      title: 'Sondage satisfaction employés',
      content: 'Participez au sondage annuel de satisfaction employés ! Vos retours sont essentiels pour améliorer nos conditions de travail. Le sondage est anonyme et prend 10 minutes à compléter.',
      category: 'hr',
      priority: 'normal',
      author: 'Direction RH',
      date: '20/06/2025',
      image: '📊',
      tags: ['Sondage', 'Satisfaction', 'RH'],
      read: false,
      featured: false
    }
  ]);

  const categories = {
    all: { label: 'Toutes', icon: '📢', color: 'blue' },
    policy: { label: 'Politiques', icon: '📋', color: 'purple' },
    results: { label: 'Résultats', icon: '📈', color: 'green' },
    it: { label: 'IT', icon: '💻', color: 'blue' },
    training: { label: 'Formation', icon: '🎓', color: 'orange' },
    event: { label: 'Événements', icon: '🎉', color: 'pink' },
    business: { label: 'Business', icon: '💼', color: 'gray' },
    hr: { label: 'RH', icon: '👥', color: 'yellow' }
  };

  const priorityConfig = {
    high: { label: 'Important', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    normal: { label: 'Normal', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    low: { label: 'Faible', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = activeCategory === 'all' || announcement.category === activeCategory;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredAnnouncements = announcements.filter(a => a.featured);
  const unreadCount = announcements.filter(a => !a.read).length;

  const getCategoryCount = (category) => {
    if (category === 'all') return announcements.length;
    return announcements.filter(a => a.category === category).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Annonces & Actualités</h1>
            <p className="text-gray-600 mt-2">Restez informé des dernières nouvelles de l'entreprise</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annonces en vedette */}
      {featuredAnnouncements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Annonces importantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{announcement.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        En vedette
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[announcement.priority].bgColor} ${priorityConfig[announcement.priority].textColor}`}>
                        {priorityConfig[announcement.priority].label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{announcement.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{announcement.author} • {announcement.date}</span>
                      <div className="flex space-x-1">
                        {announcement.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres par catégorie */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-3">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                {getCategoryCount(key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-6">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${!announcement.read ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{announcement.image}</div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                  {!announcement.read && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      Nouveau
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[announcement.priority].bgColor} ${priorityConfig[announcement.priority].textColor}`}>
                    {priorityConfig[announcement.priority].label}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{announcement.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{announcement.author}</span>
                    <span>•</span>
                    <span>{announcement.date}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      <span>{categories[announcement.category].label}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {announcement.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                      </svg>
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        )}
      </div>

      {/* Statistiques en bas de page */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques des annonces</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{announcements.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{announcements.filter(a => a.priority === 'high').length}</div>
            <div className="text-sm text-gray-600">Importantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{featuredAnnouncements.length}</div>
            <div className="text-sm text-gray-600">En vedette</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(categories).length - 1}</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcements; 