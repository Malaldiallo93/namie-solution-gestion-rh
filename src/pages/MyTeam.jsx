import React, { useState } from 'react';

function MyTeam() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées de l'équipe (même département - Assurance)
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Marie Dupont',
      position: 'Chef d\'équipe',
      avatar: 'MD',
      status: 'available',
      availability: 'Disponible',
      lastSeen: 'À l\'instant',
      email: 'marie.dupont@vaes.com',
      phone: '+33 1 23 45 67 01',
      department: 'Assurance',
      skills: ['Gestion d\'équipe', 'Relation client', 'Excel', 'SAP'],
      currentProject: 'Gestion des sinistres auto',
      workload: 85,
      location: 'Bureau 2A',
      startDate: '15/03/2020',
      languages: ['Français', 'Anglais'],
      workingHours: '9h-17h',
      avatarColor: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Thomas Martin',
      position: 'Expert sinistres',
      avatar: 'TM',
      status: 'busy',
      availability: 'Occupé',
      lastSeen: 'Il y a 5 min',
      email: 'thomas.martin@vaes.com',
      phone: '+33 1 23 45 67 02',
      department: 'Assurance',
      skills: ['Expertise technique', 'Analyse de risques', 'PowerBI', 'Word'],
      currentProject: 'Évaluation des dommages',
      workload: 92,
      location: 'Bureau 2B',
      startDate: '10/09/2021',
      languages: ['Français', 'Espagnol'],
      workingHours: '8h30-16h30',
      avatarColor: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Pierre Durand',
      position: 'Analyste données',
      avatar: 'PD',
      status: 'away',
      availability: 'Absent',
      lastSeen: 'Il y a 1h',
      email: 'pierre.durand@vaes.com',
      phone: '+33 1 23 45 67 04',
      department: 'Assurance',
      skills: ['Analyse de données', 'SQL', 'Python', 'Tableau'],
      currentProject: 'Rapport trimestriel',
      workload: 65,
      location: 'Bureau 2D',
      startDate: '05/06/2023',
      languages: ['Français', 'Anglais'],
      workingHours: '8h-16h',
      avatarColor: 'bg-orange-500'
    },
    {
      id: 4,
      name: 'Emma Leroy',
      position: 'Assistante administrative',
      avatar: 'EL',
      status: 'available',
      availability: 'Disponible',
      lastSeen: 'À l\'instant',
      email: 'emma.leroy@vaes.com',
      phone: '+33 1 23 45 67 05',
      department: 'Assurance',
      skills: ['Administration', 'Organisation', 'Excel', 'PowerPoint'],
      currentProject: 'Gestion des dossiers',
      workload: 70,
      location: 'Bureau 2E',
      startDate: '12/11/2022',
      languages: ['Français'],
      workingHours: '9h-17h',
      avatarColor: 'bg-pink-500'
    },
    {
      id: 5,
      name: 'Camille Rousseau',
      position: 'Spécialiste contentieux',
      avatar: 'CR',
      status: 'busy',
      availability: 'Occupé',
      lastSeen: 'Il y a 8 min',
      email: 'camille.rousseau@vaes.com',
      phone: '+33 1 23 45 67 07',
      department: 'Assurance',
      skills: ['Contentieux', 'Droit', 'Gestion de crise', 'Négociation'],
      currentProject: 'Dossier litigieux',
      workload: 95,
      location: 'Bureau 2G',
      startDate: '18/04/2021',
      languages: ['Français', 'Anglais', 'Allemand'],
      workingHours: '8h30-16h30',
      avatarColor: 'bg-red-500'
    },
    {
      id: 6,
      name: 'Antoine Dubois',
      position: 'Technicien informatique',
      avatar: 'AD',
      status: 'available',
      availability: 'Disponible',
      lastSeen: 'À l\'instant',
      email: 'antoine.dubois@vaes.com',
      phone: '+33 1 23 45 67 08',
      department: 'Assurance',
      skills: ['Support IT', 'Maintenance', 'Réseau', 'Sécurité'],
      currentProject: 'Maintenance système',
      workload: 60,
      location: 'Bureau 2H',
      startDate: '03/03/2023',
      languages: ['Français', 'Anglais'],
      workingHours: '8h-16h',
      avatarColor: 'bg-indigo-500'
    }
  ]);

  const statusConfig = {
    available: { 
      label: 'Disponible', 
      color: 'green', 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-800',
      icon: '🟢'
    },
    busy: { 
      label: 'Occupé', 
      color: 'orange', 
      bgColor: 'bg-orange-100', 
      textColor: 'text-orange-800',
      icon: '🟡'
    },
    away: { 
      label: 'Absent', 
      color: 'gray', 
      bgColor: 'bg-gray-100', 
      textColor: 'text-gray-800',
      icon: '⚪'
    }
  };

  const filterConfig = {
    all: { label: 'Tous', count: teamMembers.length },
    available: { label: 'Disponibles', count: teamMembers.filter(m => m.status === 'available').length },
    busy: { label: 'Occupés', count: teamMembers.filter(m => m.status === 'busy').length },
    away: { label: 'Absents', count: teamMembers.filter(m => m.status === 'away').length }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesFilter = activeFilter === 'all' || member.status === activeFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return 'text-red-600';
    if (workload >= 75) return 'text-orange-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getWorkloadBgColor = (workload) => {
    if (workload >= 90) return 'bg-red-100';
    if (workload >= 75) return 'bg-orange-100';
    if (workload >= 60) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mon Équipe</h1>
            <p className="text-gray-600 mt-2">Département Assurance - {teamMembers.length} membres</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un collègue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nouveau membre
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques de l'équipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{teamMembers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{filterConfig.available.count}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupés</p>
              <p className="text-2xl font-bold text-orange-600">{filterConfig.busy.count}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-3">
          {Object.entries(filterConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{statusConfig[key]?.icon || '👥'}</span>
              <span>{config.label}</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                {config.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des membres de l'équipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* En-tête du membre */}
            <div className="flex items-start space-x-4 mb-4">
              <div className={`w-16 h-16 ${member.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {member.avatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                  {member.position === 'Chef d\'équipe' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      Chef
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{member.position}</p>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[member.status].bgColor} ${statusConfig[member.status].textColor}`}>
                    {statusConfig[member.status].icon} {statusConfig[member.status].label}
                  </span>
                  <span className="text-xs text-gray-500">{member.lastSeen}</span>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-gray-600">{member.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-gray-600">{member.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-gray-600">{member.location}</span>
              </div>
            </div>

            {/* Projet actuel et charge de travail */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Projet actuel</span>
                <span className="text-xs text-gray-500">Charge de travail</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{member.currentProject}</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getWorkloadBgColor(member.workload)}`}
                    style={{ width: `${member.workload}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${getWorkloadColor(member.workload)}`}>
                  {member.workload}%
                </span>
              </div>
            </div>

            {/* Compétences */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Compétences</span>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{member.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </button>
              </div>
              
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Voir profil
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
        </div>
      )}
    </div>
  );
}

export default MyTeam; 