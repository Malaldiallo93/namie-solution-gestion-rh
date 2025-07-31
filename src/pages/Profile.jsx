import React, { useState } from 'react';

function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // États pour les assignations
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [activeFilter, setActiveFilter] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedAssignments, setSelectedAssignments] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Données simulées de l'employé
  const [employeeData, setEmployeeData] = useState({
    personal: {
      firstName: 'Hadja Fatoumata',
      lastName: 'DOUMBOUYA',
      email: 'hadja.fatoumatadoumbouya@vaes.com',
      identity: 'Y1362100P',
      id: '77',
      birthDate: '20/12/1996',
      socialSecurity: '08/12630380-76',
      language: 'Français'
    },
    professional: {
      position: 'Claims handler',
      department: 'Assurance',
      startDate: '15/03/2023',
      contractType: 'CDI',
      manager: 'Marie Dupont',
      skills: ['Gestion des sinistres', 'Relation client', 'Excel', 'SAP']
    },
    company: {
      employeeId: 'EMP-2023-001',
      location: 'Local Business France',
      office: 'Bureau 3A',
      phone: '+33 1 23 45 67 89',
      emergencyContact: 'Mamadou DOUMBOUYA - +33 6 12 34 56 78'
    },
    assignments: {
      available: 21,
      reserved: 15,
      assigned: 36
    }
  });

  const [formData, setFormData] = useState(employeeData);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setEmployeeData(formData);
    setIsEditing(false);
    // Ici on pourrait ajouter une API call pour sauvegarder
    alert('Données sauvegardées avec succès !');
  };

  const handleCancel = () => {
    setFormData(employeeData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Données personnelles', icon: '👤' },
    { id: 'professional', label: 'Données professionnelles', icon: '💼' },
    { id: 'company', label: 'Données de l\'entreprise', icon: '🏢' },
    { id: 'assignments', label: 'Assignations', icon: '📋' },
    { id: 'requests', label: 'Demandes', icon: '📝' },
    { id: 'calendar', label: 'Calendrier', icon: '📅' }
  ];

  const renderPersonalData = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Données personnelles</h2>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Modifier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
            <input
              type="text"
              value={formData.personal.firstName}
              onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={formData.personal.email}
              onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Identité (En option)</label>
            <input
              type="text"
              value={formData.personal.identity}
              onChange={(e) => handleInputChange('personal', 'identity', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID (En option)</label>
            <input
              type="text"
              value={formData.personal.id}
              onChange={(e) => handleInputChange('personal', 'id', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom (En option)</label>
            <input
              type="text"
              value={formData.personal.lastName}
              onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance (En option)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.personal.birthDate}
                onChange={(e) => handleInputChange('personal', 'birthDate', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de Sécurité sociale (En option)</label>
            <input
              type="text"
              value={formData.personal.socialSecurity}
              onChange={(e) => handleInputChange('personal', 'socialSecurity', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
            <select
              value={formData.personal.language}
              onChange={(e) => handleInputChange('personal', 'language', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="Français">Français</option>
              <option value="English">English</option>
              <option value="Español">Español</option>
              <option value="Deutsch">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalData = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Données professionnelles</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
            <input
              type="text"
              value={formData.professional.position}
              onChange={(e) => handleInputChange('professional', 'position', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
            <input
              type="text"
              value={formData.professional.department}
              onChange={(e) => handleInputChange('professional', 'department', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
            <input
              type="text"
              value={formData.professional.startDate}
              onChange={(e) => handleInputChange('professional', 'startDate', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
            <select
              value={formData.professional.contractType}
              onChange={(e) => handleInputChange('professional', 'contractType', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
            <input
              type="text"
              value={formData.professional.manager}
              onChange={(e) => handleInputChange('professional', 'manager', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
            <textarea
              value={formData.professional.skills.join(', ')}
              onChange={(e) => handleInputChange('professional', 'skills', e.target.value.split(', '))}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Séparez les compétences par des virgules"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyData = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Données de l'entreprise</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Employé</label>
            <input
              type="text"
              value={formData.company.employeeId}
              onChange={(e) => handleInputChange('company', 'employeeId', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <input
              type="text"
              value={formData.company.location}
              onChange={(e) => handleInputChange('company', 'location', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bureau</label>
            <input
              type="text"
              value={formData.company.office}
              onChange={(e) => handleInputChange('company', 'office', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.company.phone}
              onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact d'urgence</label>
            <textarea
              value={formData.company.emergencyContact}
              onChange={(e) => handleInputChange('company', 'emergencyContact', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => {
    // Données simulées des assignations comme sur l'image
    const assignments = [
      {
        id: 1,
        type: 'summary',
        reason: 'Vacances',
        assigned: 36,
        available: 10,
        creationDate: '',
        startDate: '',
        endDate: '',
        observations: '',
        details: [
          { id: 2, assigned: 10, available: 10, creationDate: '05/05/2025', startDate: '05/05/2025', endDate: '31/03/2026', observations: 'Añadido dias de va...' },
          { id: 3, assigned: 3, available: 0, creationDate: '22/04/2025', startDate: '22/04/2025', endDate: '31/03/2026', observations: 'Exceso de horas tra...' },
          { id: 4, assigned: 8, available: 0, creationDate: '15/03/2025', startDate: '15/03/2025', endDate: '31/03/2026', observations: 'Vacances d\'été' },
          { id: 5, assigned: 15, available: 0, creationDate: '01/01/2025', startDate: '01/01/2025', endDate: '31/12/2025', observations: 'Quota annuelle' }
        ]
      },
      {
        id: 6,
        type: 'summary',
        reason: 'RTT',
        assigned: 12,
        available: 8,
        creationDate: '',
        startDate: '',
        endDate: '',
        observations: '',
        details: [
          { id: 7, assigned: 4, available: 0, creationDate: '10/06/2025', startDate: '10/06/2025', endDate: '31/12/2025', observations: 'RTT juin' },
          { id: 8, assigned: 8, available: 8, creationDate: '01/01/2025', startDate: '01/01/2025', endDate: '31/12/2025', observations: 'RTT disponibles' }
        ]
      },
      {
        id: 9,
        type: 'summary',
        reason: 'Congés spéciaux',
        assigned: 5,
        available: 3,
        creationDate: '',
        startDate: '',
        endDate: '',
        observations: '',
        details: [
          { id: 10, assigned: 2, available: 0, creationDate: '20/05/2025', startDate: '20/05/2025', endDate: '31/12/2025', observations: 'Mariage' },
          { id: 11, assigned: 3, available: 3, creationDate: '01/01/2025', startDate: '01/01/2025', endDate: '31/12/2025', observations: 'Disponibles' }
        ]
      },
      {
        id: 12,
        type: 'adjustment',
        reason: 'Ajuste del año anterior',
        assigned: -6,
        available: 0,
        creationDate: '31/03/2025',
        startDate: '',
        endDate: '',
        observations: 'Días caducados',
        details: []
      },
      {
        id: 13,
        type: 'adjustment',
        reason: 'Ajuste del año anterior',
        assigned: -3,
        available: 0,
        creationDate: '31/03/2025',
        startDate: '',
        endDate: '',
        observations: 'Días caducados',
        details: []
      },
      {
        id: 14,
        type: 'adjustment',
        reason: 'Ajuste del año anterior',
        assigned: 6,
        available: 0,
        creationDate: '01/01/2025',
        startDate: '01/01/2025',
        endDate: '31/03/2025',
        observations: '',
        details: []
      }
    ];

    // Fonctions de filtrage et tri
    const filteredAssignments = assignments.filter(assignment => {
      if (filterType === 'all') return true;
      if (filterType === 'summary') return assignment.type === 'summary';
      if (filterType === 'adjustment') return assignment.type === 'adjustment';
      if (filterType === 'vacations') return assignment.reason === 'Vacances';
      if (filterType === 'rtt') return assignment.reason === 'RTT';
      if (filterType === 'special') return assignment.reason === 'Congés spéciaux';
      return true;
    });

    const sortedAssignments = [...filteredAssignments].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'reason':
          aValue = a.reason;
          bValue = b.reason;
          break;
        case 'assigned':
          aValue = a.assigned;
          bValue = b.assigned;
          break;
        case 'available':
          aValue = a.available;
          bValue = b.available;
          break;
        case 'creationDate':
          aValue = new Date(a.creationDate || '1900-01-01');
          bValue = new Date(b.creationDate || '1900-01-01');
          break;
        default:
          aValue = a.reason;
          bValue = b.reason;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAssignments = sortedAssignments.slice(startIndex, endIndex);

    const toggleRowExpansion = (id) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedRows(newExpanded);
    };

    const toggleSelection = (id) => {
      const newSelected = new Set(selectedAssignments);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedAssignments(newSelected);
    };

    const handleSort = (field) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    };

    const getAssignedColor = (assigned) => {
      if (assigned < 0) return 'text-red-600';
      if (assigned === 0) return 'text-gray-600';
      return 'text-green-600';
    };

    const getAssignedBgColor = (assigned) => {
      if (assigned < 0) return 'bg-red-50';
      if (assigned === 0) return 'bg-gray-50';
      return 'bg-green-50';
    };

    return (
      <div className="space-y-6">
        {/* En-tête avec titre et contrôles */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Assignations</h2>
          <div className="flex items-center space-x-4">
            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              <span>Filtres</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{activeFilter}</span>
            </button>
            
            {/* Actions en lot */}
            {selectedAssignments.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedAssignments.size} sélectionné(s)</span>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Supprimer
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Exporter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'assignation</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="summary">Résumés</option>
                  <option value="adjustment">Ajustements</option>
                  <option value="vacations">Vacances</option>
                  <option value="rtt">RTT</option>
                  <option value="special">Congés spéciaux</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tri par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="reason">Motif</option>
                  <option value="assigned">Assigné</option>
                  <option value="available">Disponible</option>
                  <option value="creationDate">Date de création</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">Décroissant</option>
                  <option value="asc">Croissant</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des assignations */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.size === currentAssignments.length && currentAssignments.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssignments(new Set(currentAssignments.map(a => a.id)));
                        } else {
                          setSelectedAssignments(new Set());
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('reason')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Motif</span>
                      {sortBy === 'reason' && (
                        <svg className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('assigned')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Assigné</span>
                      {sortBy === 'assigned' && (
                        <svg className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('available')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Disponible</span>
                      {sortBy === 'available' && (
                        <svg className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('creationDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Création</span>
                      {sortBy === 'creationDate' && (
                        <svg className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Début de jouissance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin de jouissance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAssignments.map((assignment) => (
                  <React.Fragment key={assignment.id}>
                    <tr className={`hover:bg-gray-50 ${selectedAssignments.has(assignment.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAssignments.has(assignment.id)}
                          onChange={() => toggleSelection(assignment.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {assignment.type === 'summary' && assignment.details.length > 0 && (
                            <button
                              onClick={() => toggleRowExpansion(assignment.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className={`w-4 h-4 transition-transform ${expandedRows.has(assignment.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                              </svg>
                            </button>
                          )}
                          <span className="text-sm font-medium text-gray-900">{assignment.reason}</span>
                          {assignment.type === 'summary' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {assignment.details.length} détails
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAssignedBgColor(assignment.assigned)} ${getAssignedColor(assignment.assigned)}`}>
                          {assignment.assigned > 0 ? '+' : ''}{assignment.assigned} jours
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.available} jours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.creationDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.startDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.endDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.observations || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Lignes de détails déroulantes */}
                    {expandedRows.has(assignment.id) && assignment.details && assignment.details.map((detail) => (
                      <tr key={`detail-${detail.id}`} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-6">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <input
                              type="checkbox"
                              checked={selectedAssignments.has(detail.id)}
                              onChange={() => toggleSelection(detail.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-6">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">{assignment.reason}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAssignedBgColor(detail.assigned)} ${getAssignedColor(detail.assigned)}`}>
                            {detail.assigned > 0 ? '+' : ''}{detail.assigned} jours
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          {detail.available} jours
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          {detail.creationDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          {detail.startDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          {detail.endDate}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          {detail.observations}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, assignments.length)} de {assignments.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                &lt;
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                />
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                &gt;
              </button>
              
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10/page</option>
                <option value={25}>25/page</option>
                <option value={50}>50/page</option>
                <option value={100}>100/page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{employeeData.assignments.available}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
            <div className="text-xs text-gray-500">jours</div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{employeeData.assignments.reserved}</div>
            <div className="text-sm text-gray-600">Réservés</div>
            <div className="text-xs text-gray-500">jours</div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{employeeData.assignments.assigned}</div>
            <div className="text-sm text-gray-600">Assignés</div>
            <div className="text-xs text-gray-500">jours</div>
          </div>
        </div>
      </div>
    );
  };

  const renderRequests = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Demandes</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mes demandes</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Nouvelle demande
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium">Demande de congés</div>
              <div className="text-sm text-gray-500">15/08/2025 - 22/08/2025 (5 jours)</div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">En attente</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium">Demande de formation</div>
              <div className="text-sm text-gray-500">Formation Excel avancé</div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approuvée</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium">Demande de télétravail</div>
              <div className="text-sm text-gray-500">2 jours par semaine</div>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Refusée</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Calendrier</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i + 1;
            const isCurrentMonth = day <= 31;
            const isToday = day === 15; // Simuler aujourd'hui
            const hasEvent = [5, 12, 18, 25].includes(day);
            
            return (
              <div
                key={i}
                className={`h-12 border border-gray-200 flex items-center justify-center text-sm ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-100 border-blue-300' : ''} ${
                  hasEvent ? 'bg-green-50 border-green-300' : ''
                }`}
              >
                {isCurrentMonth && (
                  <div className="relative">
                    <span className={isToday ? 'font-bold text-blue-600' : ''}>
                      {day}
                    </span>
                    {hasEvent && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300"></div>
            <span>Aujourd'hui</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-50 border border-green-300"></div>
            <span>Événements</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
              HD
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </button>
          </div>
          
          {/* Informations principales */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {employeeData.personal.firstName} {employeeData.personal.lastName}
            </h1>
            <p className="text-lg text-gray-600 mb-1">{employeeData.professional.position}</p>
            <p className="text-gray-500">{employeeData.company.location}</p>
          </div>
          
          {/* Statistiques */}
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{employeeData.assignments.available}</div>
              <div className="text-sm text-gray-600">Disponibles</div>
              <div className="text-xs text-gray-500">jours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{employeeData.assignments.reserved}</div>
              <div className="text-sm text-gray-600">Réservés</div>
              <div className="text-xs text-gray-500">jours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{employeeData.assignments.assigned}</div>
              <div className="text-sm text-gray-600">Assignés</div>
              <div className="text-xs text-gray-500">jours</div>
            </div>
          </div>
          
          {/* Bouton Actions */}
          <div className="relative">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <span>Actions</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'personal' && renderPersonalData()}
          {activeTab === 'professional' && renderProfessionalData()}
          {activeTab === 'company' && renderCompanyData()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'calendar' && renderCalendar()}
        </div>
      </div>
    </div>
  );
}

export default Profile; 