import React, { useState, useEffect } from 'react';

function AttendanceTable() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState('all'); // all, present, absent, remote

  // Données simulées des employés avec pointages de sortie
  useEffect(() => {
    const mockEmployees = [
      { id: 1, name: 'Marie Dupont', department: 'IT', status: 'present', checkIn: '08:15', checkOut: '17:30', avatar: 'MD' },
      { id: 2, name: 'Jean Martin', department: 'Marketing', status: 'remote', checkIn: '08:30', checkOut: null, avatar: 'JM' },
      { id: 3, name: 'Sophie Bernard', department: 'Ventes', status: 'present', checkIn: '07:45', checkOut: '16:45', avatar: 'SB' },
      { id: 4, name: 'Pierre Durand', department: 'Finance', status: 'absent', checkIn: null, checkOut: null, avatar: 'PD' },
      { id: 5, name: 'Emma Leroy', department: 'RH', status: 'present', checkIn: '08:00', checkOut: '17:15', avatar: 'EL' },
      { id: 6, name: 'Lucas Moreau', department: 'IT', status: 'remote', checkIn: '09:00', checkOut: null, avatar: 'LM' },
      { id: 7, name: 'Chloé Simon', department: 'Opérations', status: 'present', checkIn: '08:20', checkOut: '18:00', avatar: 'CS' },
      { id: 8, name: 'Thomas Roux', department: 'R&D', status: 'absent', checkIn: null, checkOut: null, avatar: 'TR' },
      { id: 9, name: 'Julie Petit', department: 'Marketing', status: 'present', checkIn: '08:10', checkOut: '17:45', avatar: 'JP' },
      { id: 10, name: 'Nicolas Robert', department: 'Ventes', status: 'remote', checkIn: '08:45', checkOut: null, avatar: 'NR' },
    ];
    setEmployees(mockEmployees);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'remote':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'remote':
        return 'Télétravail';
      case 'absent':
        return 'Absent';
      default:
        return 'Inconnu';
    }
  };

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    const totalMinutes = outMinutes - inMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  };

  const filteredEmployees = employees.filter(employee => {
    if (filter === 'all') return true;
    return employee.status === filter;
  });

  const stats = {
    present: employees.filter(e => e.status === 'present').length,
    remote: employees.filter(e => e.status === 'remote').length,
    absent: employees.filter(e => e.status === 'absent').length,
    total: employees.length
  };

  return (
    <div className="p-6">
      {/* Filtres et statistiques */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtrer par:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous ({stats.total})</option>
              <option value="present">Présents ({stats.present})</option>
              <option value="remote">Télétravail ({stats.remote})</option>
              <option value="absent">Absents ({stats.absent})</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Présent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Télétravail</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Employé</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Département</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Statut</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Pointage</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Sortie</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Heures</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      {employee.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">{employee.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {employee.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{employee.department}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {employee.checkIn ? (
                      <div className="text-gray-800 dark:text-gray-100 font-medium">
                        {employee.checkIn}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Non pointé</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {employee.checkOut ? (
                      <div className="text-gray-800 dark:text-gray-100 font-medium">
                        {employee.checkOut}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">En cours</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {calculateWorkHours(employee.checkIn, employee.checkOut) ? (
                      <div className="text-gray-800 dark:text-gray-100 font-medium">
                        {calculateWorkHours(employee.checkIn, employee.checkOut)}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Détails
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm">
                      Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Affichage de {filteredEmployees.length} employé(s) sur {employees.length}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            Précédent
          </button>
          <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTable; 