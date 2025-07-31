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
    const data = await this.request('/dashboard/metrics');
    if (data && data.success) return data.data;
    
    // Fallback mock data
    return {
      employees: {
        total: 120,
        active: 115,
        new_this_month: Math.floor(Math.random() * 5) + 1,
        by_department: []
      },
      attendance: {
        present_today: Math.floor(Math.random() * 20) + 80,
        absent_today: Math.floor(Math.random() * 8) + 2,
        late_today: Math.floor(Math.random() * 5),
        remote_workers: Math.floor(Math.random() * 15) + 10
      },
      leaves: {
        pending: Math.floor(Math.random() * 10) + 5,
        approved_this_month: Math.floor(Math.random() * 8) + 3,
        sick_leaves: Math.floor(Math.random() * 5) + 2
      },
      timesheets: {
        total_hours_this_week: Math.floor(Math.random() * 200) + 400,
        overtime_hours_this_week: Math.floor(Math.random() * 50) + 20,
        average_hours_per_day: Math.floor(Math.random() * 2) + 7
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