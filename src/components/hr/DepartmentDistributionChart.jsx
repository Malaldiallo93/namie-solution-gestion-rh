import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';
import { chartColors } from '../../charts/ChartjsConfig';
import {
  Chart, DoughnutController, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function DepartmentDistributionChart() {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Données de répartition par département - Simplifiées et plus lisibles
  const departmentData = {
    labels: ['IT', 'Marketing', 'Ventes', 'Finance', 'RH', 'Opérations'],
    datasets: [{
      data: [28, 18, 32, 12, 10, 20],
      backgroundColor: [
        '#3b82f6', // Bleu IT
        '#10b981', // Vert Marketing
        '#8b5cf6', // Violet Ventes
        '#f59e0b', // Orange Finance
        '#ef4444', // Rouge RH
        '#06b6d4', // Cyan Opérations
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff',
    }],
  };

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: departmentData,
      options: {
        layout: {
          padding: 20,
        },
        cutout: '65%',
        plugins: {
          legend: {
            display: false, // On va créer notre propre légende
          },
          tooltip: {
            titleFont: {
              weight: 600,
            },
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} employés (${percentage}%)`;
              },
            },
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
          animateRotate: true,
          animateScale: true,
        },
        maintainAspectRatio: false,
      },
    });
    
    setChart(newChart);
    return () => newChart.destroy();
  }, [darkMode]);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.plugins.legend.labels.color = textColor.dark;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins.legend.labels.color = textColor.light;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme, chart]);

  // Calculer le total des employés
  const totalEmployees = departmentData.datasets[0].data.reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center justify-between p-6">
      {/* Légende à gauche */}
      <div className="flex-1 pr-6">
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {totalEmployees} employés
          </div>
        </div>
        
        <div className="space-y-3">
          {departmentData.labels.map((label, index) => {
            const value = departmentData.datasets[0].data[index];
            const percentage = ((value / totalEmployees) * 100).toFixed(1);
            const color = departmentData.datasets[0].backgroundColor[index];
            
            return (
              <div key={label} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {value} employés
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Graphique à droite */}
      <div className="flex-shrink-0">
        <div className="relative">
          <canvas ref={canvas} width={200} height={200}></canvas>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {totalEmployees}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Total
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentDistributionChart; 