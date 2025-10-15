import React, { useState, useEffect } from 'react';

function Departements() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    manager_id: '',
    budget: '',
    department_type: '',
    target_headcount: '',
    objectives: '',
    key_skills: ''
  });

  // Charger les départements
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departments');
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des départements:', error);
    }
  };

  // Charger les employés
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/employees');
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des employés:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDepartments(), fetchEmployees()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Ajouter un département
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartment),
      });

      const data = await response.json();
      if (data.success) {
        await fetchDepartments();
        setNewDepartment({
          name: '',
          description: '',
          manager_id: '',
          budget: '',
          department_type: '',
          target_headcount: '',
          objectives: '',
          key_skills: ''
        });
        setShowAddModal(false);
        alert('✅ Département créé avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la création du département');
    }
  };

  // Modifier un département
  const handleEditDepartment = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return;

    try {
      const response = await fetch(`http://localhost:8000/api/departments/${selectedDepartment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedDepartment),
      });

      const data = await response.json();
      if (data.success) {
        await fetchDepartments();
        setShowEditModal(false);
        setSelectedDepartment(null);
        alert('✅ Département modifié avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la modification du département');
    }
  };

  // Assigner un employé à un département
  const handleAssignEmployee = async (employeeId) => {
    if (!selectedDepartment) return;

    try {
      const response = await fetch(`http://localhost:8000/api/departments/${selectedDepartment.id}/assign-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });

      const data = await response.json();
      if (data.success) {
        await Promise.all([fetchDepartments(), fetchEmployees()]);
        setShowAssignModal(false);
        setSelectedDepartment(null);
        alert('✅ Employé assigné avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de l\'assignation');
    }
  };

  // Supprimer un département
  const handleDeleteDepartment = async (department) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le département "${department.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/departments/${department.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchDepartments();
        alert('✅ Département supprimé avec succès !');
      } else {
        alert('❌ Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la suppression');
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
            Gestion des Départements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez et gérez les départements de votre entreprise
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
            <span className="ml-2">Ajouter un département</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Total Départements</p>
              <p className="text-3xl font-bold text-white">{departments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Départements Actifs</p>
              <p className="text-3xl font-bold text-white">
                {departments.filter(d => d.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Total Employés</p>
              <p className="text-3xl font-bold text-white">
                {departments.reduce((sum, dept) => sum + dept.employee_count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 100 4h8a2 2 0 100-4H4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Budget Total</p>
              <p className="text-3xl font-bold text-white">
                {departments.reduce((sum, dept) => sum + (parseFloat(dept.budget) || 0), 0).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des départements */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            📋 Liste des Départements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos départements et assignez des employés
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        {department.code.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {department.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {department.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {department.manager ? (
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {department.manager.name}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {department.employee_count} employé{department.employee_count > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedDepartment(department);
                          setShowAssignModal(true);
                        }}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Assigner
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {department.formatted_budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {department.location || 'Non définie'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      department.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {department.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDepartment(department);
                          setShowEditModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 hover:bg-violet-200 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  🏢 Créer un nouveau département
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Renseignez les informations complètes du département
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
            <form onSubmit={handleAddDepartment} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations principales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    📋 Informations générales
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du département *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                      placeholder="ex: Ressources Humaines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code département (auto-généré)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={newDepartment.name ? newDepartment.name.substring(0, 3).toUpperCase() : ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      placeholder="Généré automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description complète
                    </label>
                    <textarea
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                      rows="4"
                      placeholder="Décrivez les missions, responsabilités et objectifs du département..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de département
                    </label>
                    <select
                      value={newDepartment.department_type || ''}
                      onChange={(e) => setNewDepartment({...newDepartment, department_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="operationnel">Opérationnel</option>
                      <option value="support">Support</option>
                      <option value="direction">Direction</option>
                      <option value="commercial">Commercial</option>
                      <option value="technique">Technique</option>
                    </select>
                  </div>
                </div>

                {/* Informations organisationnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    👥 Organisation & Budget
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager du département
                    </label>
                    <select
                      value={newDepartment.manager_id}
                      onChange={(e) => setNewDepartment({...newDepartment, manager_id: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                    >
                      <option value="">Aucun manager assigné</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} - {emp.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget annuel (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={newDepartment.budget}
                        onChange={(e) => setNewDepartment({...newDepartment, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                        placeholder="150000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Effectif cible
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newDepartment.target_headcount || ''}
                        onChange={(e) => setNewDepartment({...newDepartment, target_headcount: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs principaux
                    </label>
                    <textarea
                      value={newDepartment.objectives || ''}
                      onChange={(e) => setNewDepartment({...newDepartment, objectives: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                      rows="3"
                      placeholder="Listez les principaux objectifs et KPIs du département..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compétences clés requises
                    </label>
                    <input
                      type="text"
                      value={newDepartment.key_skills || ''}
                      onChange={(e) => setNewDepartment({...newDepartment, key_skills: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                      placeholder="ex: Gestion, Leadership, Excel, Communication..."
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
                  🚀 Créer le département
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'assignation d'employé */}
      {showAssignModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Assigner un employé
              </h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedDepartment(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Département: <strong>{selectedDepartment.name}</strong>
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {employees.filter(emp => !emp.department_id).map(employee => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {employee.position}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignEmployee(employee.id)}
                      className="px-3 py-1 text-sm bg-violet-600 text-white rounded hover:bg-violet-700"
                    >
                      Assigner
                    </button>
                  </div>
                ))}
              </div>
              {employees.filter(emp => !emp.department_id).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Aucun employé disponible pour assignation
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departements;