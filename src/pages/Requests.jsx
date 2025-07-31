import React, { useState } from 'react';

function Requests() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'conges',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'normal'
  });

  // Données simulées des demandes
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: 'conges',
      title: 'Demande de congés d\'été',
      description: 'Congés familiaux pour les vacances d\'été',
      startDate: '15/08/2025',
      endDate: '22/08/2025',
      duration: '5 jours',
      status: 'pending',
      priority: 'normal',
      submittedDate: '01/07/2025',
      manager: 'Marie Dupont',
      comments: 'Demande en cours d\'examen'
    },
    {
      id: 2,
      type: 'formation',
      title: 'Formation Excel avancé',
      description: 'Formation pour améliorer mes compétences en Excel',
      startDate: '10/09/2025',
      endDate: '12/09/2025',
      duration: '3 jours',
      status: 'approved',
      priority: 'high',
      submittedDate: '15/06/2025',
      manager: 'Marie Dupont',
      comments: 'Formation approuvée, budget validé'
    },
    {
      id: 3,
      type: 'teletravail',
      title: 'Demande de télétravail',
      description: 'Télétravail 2 jours par semaine (mardi et jeudi)',
      startDate: '01/09/2025',
      endDate: '31/12/2025',
      duration: '4 mois',
      status: 'rejected',
      priority: 'normal',
      submittedDate: '20/06/2025',
      manager: 'Marie Dupont',
      comments: 'Refusé - Besoin de présence sur site pour les réunions'
    },
    {
      id: 4,
      type: 'materiel',
      title: 'Demande d\'équipement',
      description: 'Nouveau laptop pour améliorer la productivité',
      startDate: 'N/A',
      endDate: 'N/A',
      duration: 'N/A',
      status: 'pending',
      priority: 'low',
      submittedDate: '05/07/2025',
      manager: 'Marie Dupont',
      comments: 'En attente de validation IT'
    },
    {
      id: 5,
      type: 'rtt',
      title: 'Récupération RTT',
      description: 'Récupération des heures supplémentaires',
      startDate: '25/07/2025',
      endDate: '25/07/2025',
      duration: '1 jour',
      status: 'approved',
      priority: 'normal',
      submittedDate: '10/07/2025',
      manager: 'Marie Dupont',
      comments: 'Approuvé - RTT validé'
    },
    {
      id: 6,
      type: 'maladie',
      title: 'Arrêt maladie',
      description: 'Arrêt pour grippe',
      startDate: '20/07/2025',
      endDate: '22/07/2025',
      duration: '3 jours',
      status: 'approved',
      priority: 'high',
      submittedDate: '19/07/2025',
      manager: 'Marie Dupont',
      comments: 'Arrêt validé avec certificat médical'
    }
  ]);

  const requestTypes = {
    conges: { label: 'Congés', icon: '🏖️', color: 'blue' },
    formation: { label: 'Formation', icon: '📚', color: 'green' },
    teletravail: { label: 'Télétravail', icon: '🏠', color: 'purple' },
    materiel: { label: 'Matériel', icon: '💻', color: 'orange' },
    rtt: { label: 'RTT', icon: '⏰', color: 'yellow' },
    maladie: { label: 'Maladie', icon: '🏥', color: 'red' }
  };

  const statusConfig = {
    pending: { label: 'En attente', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    approved: { label: 'Approuvée', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    rejected: { label: 'Refusée', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    inProgress: { label: 'En cours', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
  };

  const priorityConfig = {
    low: { label: 'Faible', color: 'gray' },
    normal: { label: 'Normale', color: 'blue' },
    high: { label: 'Élevée', color: 'red' }
  };

  const filteredRequests = requests.filter(request => {
    if (activeFilter === 'all') return true;
    return request.status === activeFilter;
  });

  const handleCreateRequest = () => {
    const newId = Math.max(...requests.map(r => r.id)) + 1;
    const request = {
      ...newRequest,
      id: newId,
      status: 'pending',
      submittedDate: new Date().toLocaleDateString('fr-FR'),
      manager: 'Marie Dupont',
      comments: 'Nouvelle demande soumise'
    };
    setRequests(prev => [request, ...prev]);
    setShowNewRequestModal(false);
    setNewRequest({
      type: 'conges',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      priority: 'normal'
    });
  };

  const getStatusCount = (status) => {
    return requests.filter(r => r.status === status).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mes Demandes</h1>
          <p className="text-gray-600 mt-2">Suivez l'ensemble de vos demandes et leur statut</p>
        </div>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Nouvelle demande</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({requests.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente ({getStatusCount('pending')})
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approuvées ({getStatusCount('approved')})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Refusées ({getStatusCount('rejected')})
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Liste des demandes</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icône du type */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                    requestTypes[request.type].color === 'blue' ? 'bg-blue-100' :
                    requestTypes[request.type].color === 'green' ? 'bg-green-100' :
                    requestTypes[request.type].color === 'purple' ? 'bg-purple-100' :
                    requestTypes[request.type].color === 'orange' ? 'bg-orange-100' :
                    requestTypes[request.type].color === 'yellow' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    {requestTypes[request.type].icon}
                  </div>
                  
                  {/* Contenu principal */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[request.status].bgColor} ${statusConfig[request.status].textColor}`}>
                        {statusConfig[request.status].label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityConfig[request.priority].color === 'red' ? 'bg-red-100 text-red-800' :
                        priorityConfig[request.priority].color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {priorityConfig[request.priority].label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Période :</span>
                        <span className="ml-2 text-gray-800">{request.startDate} - {request.endDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Durée :</span>
                        <span className="ml-2 text-gray-800">{request.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Soumis le :</span>
                        <span className="ml-2 text-gray-800">{request.submittedDate}</span>
                      </div>
                    </div>
                    
                    {request.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Commentaire :</span>
                        <span className="ml-2 text-sm text-gray-800">{request.comments}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nouvelle demande */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Nouvelle demande</h2>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de demande</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(requestTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre de votre demande"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre demande en détail"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Faible</option>
                  <option value="normal">Normale</option>
                  <option value="high">Élevée</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests; 