import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

function HRMetrics() {
  const [hrData, setHrData] = useState({
    employees: {
      total: 0,
      active: 0,
      new_this_month: 0,
      by_department: []
    },
    attendance: {
      present_today: 0,
      absent_today: 0,
      late_today: 0,
      remote_workers: 0
    },
    leaves: {
      pending: 0,
      approved_this_month: 0,
      sick_leaves: 0
    },
    timesheets: {
      total_hours_this_week: 0,
      overtime_hours_this_week: 0,
      average_hours_per_day: 0
    }
  });

  // Récupération des données RH via l'API
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const data = await apiService.getHRMetrics();
        setHrData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques HR:', error);
      }
    };

    fetchHRData(); // Première récupération
    const interval = setInterval(fetchHRData, 30000); // Toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const presenceRate = hrData.employees.total > 0 ? ((hrData.attendance.present_today / hrData.employees.total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Présence */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Présence</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {hrData.attendance.present_today}/{hrData.employees.total}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {presenceRate}% de présence
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Recrutement */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nouveaux recrutements</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {hrData.employees.new_this_month}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Ce mois
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Congés maladie */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Congés maladie</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {hrData.leaves.sick_leaves}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              En cours
            </p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Départs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Départs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {hrData.leaves.pending}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              En attente
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRMetrics; 