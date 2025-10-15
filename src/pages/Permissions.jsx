import React, { useState, useEffect } from 'react';

function Permissions() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    role: 'all',
    search: ''
  });

  // Simuler l'utilisateur connecté (à remplacer par un vrai système d'auth)
  const currentUser = {
    id: 1,
    role: 'super_admin' // Peut être 'super_admin', 'admin', 'hr'
  };

  // Vérifier si l'utilisateur peut gérer les permissions
  const canManagePermissions = ['super_admin', 'admin', 'hr'].includes(currentUser.role);

  // Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users-permissions');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
    }
  };

  // Charger les permissions disponibles
  const fetchPermissions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/available-permissions');
      const data = await response.json();
      
      if (data.success) {
        setPermissions(data.data.permissions || []);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des permissions:', error);
    }
  };

  // Charger les statistiques
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/permissions-statistics');
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
    }
  };

  useEffect(() => {
    if (!canManagePermissions) {
      alert('❌ Accès refusé. Seuls les Super Admin, Admin et RH peuvent accéder à cette section.');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchPermissions(),
        fetchStatistics()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Charger les permissions d'un utilisateur spécifique
  const fetchUserPermissions = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/permissions`);
      const data = await response.json();
      
      if (data.success) {
        setUserPermissions(data.data.permissions || []);
        setSelectedUser(data.data.user);
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des permissions utilisateur:', error);
    }
  };

  // Accorder/Révoquer une permission
  const togglePermission = async (userId, permissionId, granted, reason = '') => {
    try {
      const endpoint = granted ? 'grant' : 'revoke';
      const response = await fetch(`http://localhost:8000/api/users/${userId}/permissions/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permission_id: permissionId,
          reason: reason || (granted ? 'Permission accordée' : 'Permission révoquée')
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Recharger les permissions de l'utilisateur
        await fetchUserPermissions(userId);
        await fetchUsers(); // Mettre à jour la liste des utilisateurs
        alert(`✅ Permission ${granted ? 'accordée' : 'révoquée'} avec succès !`);
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la modification de la permission');
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesSearch = filters.search === '' || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Obtenir la couleur du rôle
  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône du rôle
  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return '👑';
      case 'admin': return '🔧';
      case 'hr': return '👥';
      case 'manager': return '👨‍💼';
      case 'employee': return '👤';
      default: return '👤';
    }
  };

  if (!canManagePermissions) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Accès refusé</h2>
          <p className="text-red-600">
            Seuls les utilisateurs avec les rôles Super Admin, Admin ou RH peuvent accéder à la gestion des permissions.
          </p>
        </div>
      </div>
    );
  }

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
            🔐 Gestion des Permissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les accès et permissions des utilisateurs
          </p>
        </div>
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-lg">
          <p className="text-sm font-medium text-violet-800">
            👤 Connecté en tant que: <span className="font-bold">{currentUser.role}</span>
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {statistics.overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">👥</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Utilisateurs</p>
                <p className="text-xl font-bold">{statistics.overview.total_users}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Permissions</p>
                <p className="text-xl font-bold">{statistics.overview.total_permissions}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-xl text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Actives</p>
                <p className="text-xl font-bold">{statistics.overview.active_user_permissions}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Utilisation</p>
                <p className="text-xl font-bold">{statistics.overview.permissions_utilization}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrer par rôle
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="form-select w-full"
            >
              <option value="all">Tous les rôles</option>
              <option value="super_admin">👑 Super Admin</option>
              <option value="admin">🔧 Admin</option>
              <option value="hr">👥 RH</option>
              <option value="manager">👨‍💼 Manager</option>
              <option value="employee">👤 Employé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un utilisateur
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="form-input w-full"
              placeholder="Nom ou email..."
            />
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Utilisateurs et Permissions ({filteredUsers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-lg font-medium mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm">Modifiez vos filtres pour voir plus de résultats</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-semibold text-sm mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role_label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${user.permissions_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-0">
                          {user.active_permissions_count}/{user.total_permissions_count}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {user.permissions_percentage}% des permissions
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => fetchUserPermissions(user.id)}
                        className="bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        🔐 Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de gestion des permissions */}
      {showPermissionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  🔐 Permissions de {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)} mr-2`}>
                    {getRoleIcon(selectedUser.role)} {selectedUser.role_label}
                  </span>
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(
                  userPermissions.reduce((groups, permission) => {
                    const resource = permission.resource || 'Autres';
                    if (!groups[resource]) groups[resource] = [];
                    groups[resource].push(permission);
                    return groups;
                  }, {})
                ).map(([resource, resourcePermissions]) => (
                  <div key={resource} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                      📋 {resource}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourcePermissions.map((permission) => (
                        <div key={permission.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {permission.display_name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {permission.description}
                              </p>
                              {permission.granted && (
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    permission.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {permission.status}
                                  </span>
                                  {permission.granted_by && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      Par {permission.granted_by}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={permission.granted && permission.active}
                                  onChange={(e) => {
                                    const reason = e.target.checked ? 
                                      'Permission accordée via interface' : 
                                      'Permission révoquée via interface';
                                    togglePermission(selectedUser.id, permission.id, e.target.checked, reason);
                                  }}
                                  className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                                  permission.granted && permission.active ? 'bg-violet-600' : 'bg-gray-300'
                                }`}>
                                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                                    permission.granted && permission.active ? 'translate-x-5' : 'translate-x-0'
                                  } mt-0.5 ml-0.5`}></div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Permissions;
