// API Service for HR Dashboard
// This service centralizes all API calls and provides fallback mock data

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API call failed for ${endpoint}:`, error);
      return null;
    }
  }

  // HR Metrics
  async getHRMetrics() {
    console.log('🔍 API: Tentative d\'appel /dashboard/metrics...');
    const data = await this.request('/dashboard/metrics');
    console.log('🔍 API: Réponse reçue:', data);
    
    if (data && data.success) {
      console.log('✅ API: Utilisation des vraies données!', data.data);
      return data.data;
    }
    
    console.warn('⚠️ API: Échec - Utilisation des données mockées');
    // Fallback mock data (mis à jour avec les vraies données)
    return {
      employees: {
        total: 17,
        active: 17,
        new_this_month: 2,
        by_department: [
          { department: 'IT', count: 7 },
          { department: 'Marketing', count: 2 },
          { department: 'Ventes', count: 2 },
          { department: 'QA', count: 2 },
          { department: 'RH', count: 2 },
          { department: 'Finance', count: 1 },
          { department: 'Test', count: 1 }
        ]
      },
      attendance: {
        present_today: 0,
        absent_today: 0,
        late_today: 0,
        remote_workers: 17
      },
      leaves: {
        pending: 4,
        approved_this_month: 0,
        sick_leaves: 0
      },
      timesheets: {
        total_hours_this_week: 0,
        overtime_hours_this_week: 0,
        average_hours_per_day: 0
      }
    };
  }

  // Employee data
  async getEmployees() {
    const data = await this.request('/employees');
    if (data && data.success) return data.data;
    
    // Fallback mock data
    return [
      { id: 1, first_name: 'Marie', last_name: 'Dupont', department: 'IT', avatar: 'MD', status: 'active' },
      { id: 2, first_name: 'Jean', last_name: 'Martin', department: 'Marketing', avatar: 'JM', status: 'active' },
      { id: 3, first_name: 'Sophie', last_name: 'Bernard', department: 'Ventes', avatar: 'SB', status: 'active' },
      { id: 4, first_name: 'Pierre', last_name: 'Durand', department: 'Finance', avatar: 'PD', status: 'active' },
      { id: 5, first_name: 'Emma', last_name: 'Leroy', department: 'RH', avatar: 'EL', status: 'active' },
    ];
  }

  // Time tracking data
  async getTimeRecords(employeeId = null) {
    const endpoint = employeeId ? `/timesheets?employee_id=${employeeId}` : '/timesheets/today';
    const data = await this.request(endpoint);
    if (data && data.success) return data.data;
    
    // Fallback mock data
    return [];
  }

  // Clock in/out operations
  async clockIn(employeeId) {
    const data = await this.request(`/timesheets/${employeeId}/clock-in`, {
      method: 'POST'
    });
    return data && data.success ? data.data : null;
  }

  async clockOut(employeeId) {
    const data = await this.request(`/timesheets/${employeeId}/clock-out`, {
      method: 'POST'
    });
    return data && data.success ? data.data : null;
  }

  // Chart data
  async getChartData(chartType) {
    const endpoints = {
      departmentDistribution: '/dashboard/department-distribution',
      attendance: '/dashboard/attendance',
      leaveStatistics: '/dashboard/leave-statistics'
    };

    const endpoint = endpoints[chartType];
    if (endpoint) {
      const data = await this.request(endpoint);
      if (data && data.success) return data.data;
    }
    
    // Fallback mock data based on chart type
    const mockData = {
      genderContract: {
        labels: ['Hommes CDI', 'Hommes CDD', 'Femmes CDI', 'Femmes CDD'],
        datasets: [{
          data: [45, 15, 30, 10],
          backgroundColor: ['#3B82F6', '#60A5FA', '#EC4899', '#F472B6']
        }]
      },
      departmentDistribution: [
        { department: 'IT', count: 25 },
        { department: 'Marketing', count: 20 },
        { department: 'Ventes', count: 30 },
        { department: 'Finance', count: 15 },
        { department: 'RH', count: 10 }
      ]
    };
    
    return mockData[chartType] || {};
  }
}

export const apiService = new ApiService();
export default apiService; 