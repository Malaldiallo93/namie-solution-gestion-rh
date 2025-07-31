import React, { useState, useEffect } from 'react';

function Departements() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
    location: ''
  });
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    salary: ''
  });

  // Données simulées
  useEffect(() => {
    const mockDepartments = [
      {
        id: 1,
        name: 'Développement',
        description: 'Équipe de développement logiciel',
        manager: 'Marie Dupont',
        budget: 450000,
        location: 'Étage 3',
        employeeCount: 12,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: 2,
        name: 'Marketing',
        description: 'Stratégie marketing et communication',
        manager: 'Jean Martin',
        budget: 280000,
        location: 'Étage 2',
        employeeCount: 8,
        color: 'bg-green-100 text-green-600'
      },
      {
        id: 3,
        name: 'Ressources Humaines',
        description: 'Gestion RH et recrutement',
        manager: 'Sophie Bernard',
        budget: 180000,
        location: 'Étage 1',
        employeeCount: 5,
        color: 'bg-purple-100 text-purple-600'
      },
      {
        id: 4,
        name: 'Finance',
        description: 'Comptabilité et finances',
        manager: 'Pierre Durand',
        budget: 220000,
        location: 'Étage 1',
        employeeCount: 6,
        color: 'bg-yellow-100 text-yellow-600'
      }
    ];

    const mockEmployees = [
      { id: 1, name: 'Alice Dubois', position: 'Développeur Senior', department: 'Développement', email: 'alice.dubois@company.com', phone: '01 23 45 67 89', hireDate: '2020-03-15', salary: 65000 },
      { id: 2, name: 'Thomas Moreau', position: 'Développeur Full-Stack', department: 'Développement', email: 'thomas.moreau@company.com', phone: '01 23 45 67 90', hireDate: '2021-06-20', salary: 58000 },
      { id: 3, name: 'Emma Rousseau', position: 'Chef de Projet Marketing', department: 'Marketing', email: 'emma.rousseau@company.com', phone: '01 23 45 67 91', hireDate: '2019-11-10', salary: 62000 },
      { id: 4, name: 'Lucas Petit', position: 'Responsable Communication', department: 'Marketing', email: 'lucas.petit@company.com', phone: '01 23 45 67 92', hireDate: '2022-01-15', salary: 55000 },
      { id: 5, name: 'Camille Leroy', position: 'Recruteuse', department: 'Ressources Humaines', email: 'camille.leroy@company.com', phone: '01 23 45 67 93', hireDate: '2021-09-05', salary: 48000 },
      { id: 6, name: 'Antoine Simon', position: 'Comptable', department: 'Finance', email: 'antoine.simon@company.com', phone: '01 23 45 67 94', hireDate: '2020-12-01', salary: 52000 }
    ];

    setDepartments(mockDepartments);
    setEmployees(mockEmployees);
  }, []);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    const newDepartment = {
      id: departments.length + 1,
      ...formData,
      budget: parseFloat(formData.budget),
      employeeCount: 0,
      color: 'bg-gray-100 text-gray-600'
    };
    setDepartments([...departments, newDepartment]);
    setFormData({ name: '', description: '', manager: '', budget: '', location: '' });
    setShowAddForm(false);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      ...employeeFormData,
      department: selectedDepartment.name,
      salary: parseFloat(employeeFormData.salary)
    };
    setEmployees([...employees, newEmployee]);
    setDepartments(departments.map(dept => 
      dept.id === selectedDepartment.id 
        ? { ...dept, employeeCount: dept.employeeCount + 1 }
        : dept
    ));
    setEmployeeFormData({ name: '', position: '', email: '', phone: '', hireDate: '', salary: '' });
    setShowAddEmployeeForm(false);
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowAddEmployeeForm(false);
  };

  const getEmployeesByDepartment = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Départements
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des départements */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Départements</h2>
              </header>
              <div className="p-3">
                <div className="space-y-2">
                  {departments.map(department => (
                    <div
                      key={department.id}
                      onClick={() => handleDepartmentClick(department)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDepartment?.id === department.id
                          ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-100">{department.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{department.employeeCount} employé(s)</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${department.color}`}>
                          {department.manager}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite : bouton + formulaire + détails */}
          <div className="lg:col-span-2">
            {/* Bouton et formulaire d'ajout en haut à droite */}
            <div className="flex flex-col items-end mb-6">
              <button
                className="btn bg-violet-500 hover:bg-violet-600 text-white mb-2"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="ml-2">Nouveau département</span>
              </button>
              {showAddForm && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 w-full max-w-md mt-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Nouveau département</h3>
                  <form onSubmit={handleAddDepartment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du département
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="form-input w-full focus:border-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="form-textarea w-full focus:border-violet-500"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Manager
                      </label>
                      <input
                        type="text"
                        value={formData.manager}
                        onChange={e => setFormData({...formData, manager: e.target.value})}
                        className="form-input w-full focus:border-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budget annuel (€)
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                        className="form-input w-full focus:border-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Localisation
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="form-input w-full focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="btn border-gray-200 hover:border-gray-300 text-gray-600 flex-1"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn bg-violet-500 hover:bg-violet-600 text-white flex-1"
                      >
                        Créer
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Détails du département sélectionné */}
            {selectedDepartment ? (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">{selectedDepartment.name}</h2>
                  <button
                    className="btn bg-violet-500 hover:bg-violet-600 text-white"
                    onClick={() => setShowAddEmployeeForm(!showAddEmployeeForm)}
                  >
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Ajouter employé</span>
                  </button>
                </header>
                
                <div className="p-5">
                  {/* Informations du département */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Informations</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Description:</span>
                          <p className="text-gray-800 dark:text-gray-100">{selectedDepartment.description}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Manager:</span>
                          <p className="text-gray-800 dark:text-gray-100">{selectedDepartment.manager}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Localisation:</span>
                          <p className="text-gray-800 dark:text-gray-100">{selectedDepartment.location}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Budget annuel:</span>
                          <p className="text-gray-800 dark:text-gray-100 font-semibold">{formatCurrency(selectedDepartment.budget)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Statistiques</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{selectedDepartment.employeeCount}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Employés</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(selectedDepartment.budget / selectedDepartment.employeeCount || 0)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Budget/employé</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liste des employés */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Employés</h3>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Nom</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Poste</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Email</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Téléphone</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Date d'embauche</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Salaire</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                          {getEmployeesByDepartment(selectedDepartment.name).map(employee => (
                            <tr key={employee.id}>
                              <td className="p-2 whitespace-nowrap">
                                <div className="font-medium text-gray-800 dark:text-gray-100">{employee.name}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{employee.position}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{employee.email}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">{employee.phone}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100">
                                  {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-gray-800 dark:text-gray-100 font-medium">
                                  {formatCurrency(employee.salary)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Formulaire d'ajout d'employé intégré */}
                    {showAddEmployeeForm && (
                      <div className="mt-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                          Nouvel employé - {selectedDepartment.name}
                        </h3>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Nom complet
                            </label>
                            <input
                              type="text"
                              value={employeeFormData.name}
                              onChange={e => setEmployeeFormData({...employeeFormData, name: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Poste
                            </label>
                            <input
                              type="text"
                              value={employeeFormData.position}
                              onChange={e => setEmployeeFormData({...employeeFormData, position: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={employeeFormData.email}
                              onChange={e => setEmployeeFormData({...employeeFormData, email: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              value={employeeFormData.phone}
                              onChange={e => setEmployeeFormData({...employeeFormData, phone: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Date d'embauche
                            </label>
                            <input
                              type="date"
                              value={employeeFormData.hireDate}
                              onChange={e => setEmployeeFormData({...employeeFormData, hireDate: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Salaire annuel (€)
                            </label>
                            <input
                              type="number"
                              value={employeeFormData.salary}
                              onChange={e => setEmployeeFormData({...employeeFormData, salary: e.target.value})}
                              className="form-input w-full focus:border-violet-500"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddEmployeeForm(false)}
                              className="btn border-gray-200 hover:border-gray-300 text-gray-600 flex-1"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="btn bg-violet-500 hover:bg-violet-600 text-white flex-1"
                            >
                              Ajouter
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Sélectionnez un département pour voir les détails</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Departements; 