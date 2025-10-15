import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import EmployeesMain from './employees/EmployeesMain';
import apiService from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    department_id: '',
    position: '',
    hire_date: '',
    salary: '',
    manager_id: ''
  });

  // Charger les employés et départements depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Chargement des données depuis l\'API...');
        
        // Charger employés et départements en parallèle
        const [employeesData, departmentsResponse] = await Promise.all([
          apiService.getEmployees(),
          fetch('http://localhost:8000/api/departments').then(res => res.json())
        ]);
        
        console.log('✅ Employés chargés:', employeesData);
        console.log('✅ Départements chargés:', departmentsResponse);
        
        // Transformer les données employés
        const transformedEmployees = employeesData.map(emp => ({
          id: emp.id,
          employee_number: emp.employee_number,
          name: `${emp.first_name} ${emp.last_name}`,
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          department: emp.department,
          department_id: emp.department_id,
          position: emp.position,
          startDate: emp.hire_date,
          status: 'active',
          avatar: `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase(),
          salary: emp.salary
        }));
        
        setEmployees(transformedEmployees);
        
        // Stocker les départements
        if (departmentsResponse.success) {
          setDepartments(departmentsResponse.data);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        // En cas d'erreur, garder des tableaux vides
        setEmployees([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      console.log('🔍 Ajout d\'un employé via API:', newEmployee);
      
      // Appeler l'API pour créer l'employé
      const response = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de l\'ajout de l\'employé');
      }
      
      console.log('✅ Employé ajouté avec succès:', data.data);
      
      // Recharger la liste des employés
      const employeesData = await apiService.getEmployees();
      const transformedEmployees = employeesData.map(emp => ({
        id: emp.id,
        employee_number: emp.employee_number,
        name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email,
        department: emp.department,
        position: emp.position,
        startDate: emp.hire_date,
        status: 'active',
        avatar: `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase(),
        salary: emp.salary
      }));
      setEmployees(transformedEmployees);
      
      // Réinitialiser le formulaire
      setNewEmployee({
        employee_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        department_id: '',
        position: '',
        hire_date: '',
        salary: '',
        manager_id: ''
      });
      setShowAddModal(false);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'employé: ' + error.message);
    }
  };

  // Supprimer un employé
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Les départements sont maintenant chargés depuis l'API via le state

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
          loading,
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