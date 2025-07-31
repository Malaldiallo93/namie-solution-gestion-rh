import React, { useState, useMemo } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';

function TimeHistory({ timeRecords, employee }) {
  const { currentTheme } = useThemeProvider();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Filter records by selected month
  const monthlyRecords = useMemo(() => {
    return timeRecords.filter(record => 
      record.employeeId === employee.id && 
      record.date.startsWith(selectedMonth)
    );
  }, [timeRecords, employee.id, selectedMonth]);

  // Calculate monthly statistics
  const monthlyStats = useMemo(() => {
    const stats = {
      totalDays: monthlyRecords.length,
      totalWorkTime: 0,
      totalPauseTime: 0,
      totalBreaks: 0,
      averageWorkTime: 0,
      averagePauseTime: 0
    };

    monthlyRecords.forEach(record => {
      stats.totalWorkTime += record.workTime || 0;
      stats.totalPauseTime += record.pauseTime || 0;
      stats.totalBreaks += record.breaks?.length || 0;
    });

    if (stats.totalDays > 0) {
      stats.averageWorkTime = Math.round(stats.totalWorkTime / stats.totalDays);
      stats.averagePauseTime = Math.round(stats.totalPauseTime / stats.totalDays);
    }

    return stats;
  }, [monthlyRecords]);

  // Format time helper
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Get available months
  const availableMonths = useMemo(() => {
    const months = [...new Set(timeRecords
      .filter(record => record.employeeId === employee.id)
      .map(record => record.date.slice(0, 7))
    )];
    return months.sort().reverse();
  }, [timeRecords, employee.id]);

  // Force re-render when theme changes
  useEffect(() => {
    // This effect will trigger a re-render when theme changes
  }, [currentTheme]);

  return (
    <div className="p-6">
      {/* Month Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sélectionner un mois
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Jours travaillés</div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {monthlyStats.totalDays}
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">Temps de travail</div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {formatTime(monthlyStats.totalWorkTime)}
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Temps de pause</div>
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            {formatTime(monthlyStats.totalPauseTime)}
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Pauses prises</div>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {monthlyStats.totalBreaks}
          </div>
        </div>
      </div>

      {/* Daily Records */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Détail quotidien - {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Arrivée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Départ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Temps travail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pauses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Détail pauses
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {monthlyRecords.length > 0 ? (
                monthlyRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.startTime ? new Date(record.startTime).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.endTime ? new Date(record.endTime).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                      {formatTime(record.workTime || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                      {formatTime(record.pauseTime || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {record.breaks && record.breaks.length > 0 ? (
                        <div className="space-y-1">
                          {record.breaks.map((break_, breakIndex) => (
                            <div key={breakIndex} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                break_.type === 'lunch' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="text-xs">
                                {break_.type === 'lunch' ? 'Déjeuner' : 'Autre'}: {formatTime(break_.duration || 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Aucune pause</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun enregistrement pour ce mois
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimeHistory; 