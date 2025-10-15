import React, { useState, useEffect } from 'react';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });
  const [newRequest, setNewRequest] = useState({
    type: 'leave',
    title: '',
    description: '',
    priority: 'medium',
    amount: '',
    requested_date: '',
    end_date: '',
    due_date: ''
  });

  // Charger les demandes
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/requests');
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data.data || []);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Créer une nouvelle demande
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...newRequest,
        employee_id: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
        amount: newRequest.amount ? parseFloat(newRequest.amount) : null
      };

      const response = await fetch('http://localhost:8000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchRequests();
        setNewRequest({
          type: 'leave',
          title: '',
          description: '',
          priority: 'medium',
          amount: '',
          requested_date: '',
          end_date: '',
          due_date: ''
        });
        setShowAddModal(false);
        alert('✅ Demande créée avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la création de la demande');
    }
  };

  // Approuver une demande
  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approver_id: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
          comments: 'Approuvé'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchRequests();
        alert('✅ Demande approuvée avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de l\'approbation');
    }
  };

  // Rejeter une demande
  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:8000/api/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approver_id: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
          reason: reason
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchRequests();
        alert('✅ Demande rejetée avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors du rejet');
    }
  };

  // Filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesType = filters.type === 'all' || request.type === filters.type;
    const matchesStatus = filters.status === 'all' || request.status === filters.status;
    const matchesPriority = filters.priority === 'all' || request.priority === filters.priority;
    return matchesType && matchesStatus && matchesPriority;
  });

  // Types de demandes
  const requestTypes = [
    { value: 'leave', label: 'Congé', icon: '🏖️' },
    { value: 'expense', label: 'Note de frais', icon: '💰' },
    { value: 'document', label: 'Document', icon: '📄' },
    { value: 'equipment', label: 'Équipement', icon: '💻' },
    { value: 'training', label: 'Formation', icon: '🎓' },
    { value: 'overtime', label: 'Heures sup.', icon: '⏰' },
    { value: 'advance', label: 'Avance', icon: '💳' },
    { value: 'other', label: 'Autre', icon: '📝' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* En-tête */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            📋 Gestion des Demandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toutes vos demandes centralisées en un seul endroit
          </p>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <button
            onClick={() => setShowAddModal(true)}
            className="btn bg-violet-500 hover:bg-violet-600 text-white"
        >
            <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
            <span className="ml-2">Nouvelle demande</span>
        </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de demande
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="form-select w-full"
            >
              <option value="all">Tous les types</option>
              {requestTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="form-select w-full"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="under_review">En cours d'examen</option>
              <option value="approved">Approuvée</option>
              <option value="rejected">Rejetée</option>
              <option value="cancelled">Annulée</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priorité
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="form-select w-full"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <p className="text-sm opacity-80">Total</p>
              <p className="text-xl font-bold">{requests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-xl text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">⏳</span>
            </div>
            <div>
              <p className="text-sm opacity-80">En attente</p>
              <p className="text-xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="text-sm opacity-80">Approuvées</p>
              <p className="text-xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-xl text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">❌</span>
            </div>
            <div>
              <p className="text-sm opacity-80">Rejetées</p>
              <p className="text-xl font-bold">{requests.filter(r => r.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Liste des demandes ({filteredRequests.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
                  </div>
              <p className="text-lg font-medium mb-2">Aucune demande trouvée</p>
              <p className="text-sm">Créez votre première demande pour commencer</p>
                    </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Demande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          #{request.request_number}
                        </div>
                        {request.employee && (
                          <div className="text-xs text-gray-400">
                            Par {request.employee.name}
                      </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {requestTypes.find(t => t.value === request.type)?.icon || '📝'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {requestTypes.find(t => t.value === request.type)?.label || request.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority === 'low' && 'Faible'}
                        {request.priority === 'medium' && 'Moyenne'}
                        {request.priority === 'high' && 'Élevée'}
                        {request.priority === 'urgent' && 'Urgente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' && 'En attente'}
                        {request.status === 'under_review' && 'En examen'}
                        {request.status === 'approved' && 'Approuvée'}
                        {request.status === 'rejected' && 'Rejetée'}
                        {request.status === 'cancelled' && 'Annulée'}
                        {request.status === 'completed' && 'Terminée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Rejeter
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                    )}
                  </div>
                </div>
                
      {/* Modal d'ajout de demande */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  📝 Nouvelle demande
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Créez une nouvelle demande qui sera traitée par votre hiérarchie
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande *
                    </label>
                <select
                      required
                  value={newRequest.type}
                      onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      {requestTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                      <option value="urgent">Urgente</option>
                    </select>
              </div>
              </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la demande *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="ex: Demande de congés pour vacances d'été"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    required
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    rows="4"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                {(newRequest.type === 'expense' || newRequest.type === 'advance') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newRequest.amount}
                      onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      value={newRequest.requested_date}
                      onChange={(e) => setNewRequest({...newRequest, requested_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={newRequest.end_date}
                      onChange={(e) => setNewRequest({...newRequest, end_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date limite
                    </label>
                    <input
                      type="date"
                      value={newRequest.due_date}
                      onChange={(e) => setNewRequest({...newRequest, due_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg shadow-lg transition-all duration-200"
                >
                  📤 Créer la demande
                </button>
              </div>
            </form>
              </div>
            </div>
      )}

      {/* Modal de détail */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de la demande #{selectedRequest.request_number}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {requestTypes.find(t => t.value === selectedRequest.type)?.label}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Titre:</span>
                      <p className="text-gray-900">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="text-gray-900">{selectedRequest.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Priorité:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority === 'low' && 'Faible'}
                        {selectedRequest.priority === 'medium' && 'Moyenne'}
                        {selectedRequest.priority === 'high' && 'Élevée'}
                        {selectedRequest.priority === 'urgent' && 'Urgente'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Statut:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status === 'pending' && 'En attente'}
                        {selectedRequest.status === 'approved' && 'Approuvée'}
                        {selectedRequest.status === 'rejected' && 'Rejetée'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates et montants</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Créée le:</span>
                      <p className="text-gray-900">{new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {selectedRequest.requested_date && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date souhaitée:</span>
                        <p className="text-gray-900">{new Date(selectedRequest.requested_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                    {selectedRequest.amount && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Montant:</span>
                        <p className="text-gray-900">{selectedRequest.amount} {selectedRequest.currency || 'EUR'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests; 