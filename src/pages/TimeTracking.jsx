import React, { useState, useEffect } from 'react';
import TimeClock from '../components/timetracking/TimeClock';
import TimeHistory from '../components/timetracking/TimeHistory';
import apiService from '../services/api';

function TimeTracking() {
  const [employees, setEmployees] = useState([]);
  const [timeRecords, setTimeRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Récupération des employés via l'API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
      }
    };
    
    fetchEmployees();
  }, []);

  // Handle time record updates
  const handleTimeUpdate = async (employeeId, action) => {
    try {
      let result;
      if (action === 'clockIn') {
        result = await apiService.clockIn(employeeId);
      } else if (action === 'clockOut') {
        result = await apiService.clockOut(employeeId);
      }
      
      if (result) {
        // Refresh time records
        const records = await apiService.getTimeRecords();
        setTimeRecords(records);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pointage:', error);
    }
  };

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Pointage et Suivi du Temps
        </h1>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white dark:bg-gray-800 shadow-xs rounded-xl">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {employee.department}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowHistory(true);
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Historique
                </button>
              </div>
            </header>
            <div className="p-6">
              <TimeClock 
                employee={employee} 
                onTimeUpdate={handleTimeUpdate}
              />
            </div>
          </div>
        ))}
      </div>

      {/* History Modal */}
      {showHistory && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Historique - {selectedEmployee.first_name} {selectedEmployee.last_name}
            </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <TimeHistory 
                timeRecords={timeRecords} 
                employee={selectedEmployee} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimeTracking; 