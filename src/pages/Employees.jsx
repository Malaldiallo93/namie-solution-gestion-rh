import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import EmployeesMain from './employees/EmployeesMain';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    status: 'active'
  });

  // Données simulées des employés
  useEffect(() => {
    const mockEmployees = [
      {
        id: 1,
        name: 'Marie Dupont',
        email: 'marie.dupont@entreprise.com',
        department: 'IT',
        position: 'Développeuse Senior',
        startDate: '2022-03-15',
        status: 'active',
        avatar: 'MD'
      },
      {
        id: 2,
        name: 'Jean Martin',
        email: 'jean.martin@entreprise.com',
        department: 'Marketing',
        position: 'Chef de Projet',
        startDate: '2021-08-22',
        status: 'active',
        avatar: 'JM'
      },
      {
        id: 3,
        name: 'Sophie Bernard',
        email: 'sophie.bernard@entreprise.com',
        department: 'Ventes',
        position: 'Commerciale',
        startDate: '2023-01-10',
        status: 'active',
        avatar: 'SB'
      },
      {
        id: 4,
        name: 'Pierre Durand',
        email: 'pierre.durand@entreprise.com',
        department: 'Finance',
        position: 'Comptable',
        startDate: '2020-11-05',
        status: 'active',
        avatar: 'PD'
      },
      {
        id: 5,
        name: 'Emma Leroy',
        email: 'emma.leroy@entreprise.com',
        department: 'RH',
        position: 'Responsable RH',
        startDate: '2021-06-18',
        status: 'active',
        avatar: 'EL'
      },
      {
        id: 6,
        name: 'Lucas Moreau',
        email: 'lucas.moreau@entreprise.com',
        department: 'IT',
        position: 'Développeur Full-Stack',
        startDate: '2023-09-12',
        status: 'active',
        avatar: 'LM'
      }
    ];
    setEmployees(mockEmployees);
  }, []);

  // Filtrer les employés
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Ajouter un nouvel employé
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      avatar: newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    setEmployees([...employees, employee]);
    setNewEmployee({
      name: '',
      email: '',
      department: '',
      position: '',
      startDate: '',
      status: 'active'
    });
    setShowAddModal(false);
  };

  // Supprimer un employé
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const departments = ['IT', 'Marketing', 'Ventes', 'Finance', 'RH'];

  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        Gestion des Employés
      </h1>
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <NavLink
              to="/employees"
              end
              className={({ isActive }) =>
                `py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Employés
            </NavLink>
            <NavLink
              to="/employees/departements"
              className={({ isActive }) =>
                `py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Départements
            </NavLink>
          </nav>
        </div>
      </div>
      <Outlet 
        context={{
          employees,
          searchTerm,
          setSearchTerm,
          filteredEmployees,
          handleDeleteEmployee,
          departments,
          showAddModal,
          setShowAddModal,
          newEmployee,
          setNewEmployee,
          handleAddEmployee
        }}
      />
    </div>
  );
}

export default Employees; 