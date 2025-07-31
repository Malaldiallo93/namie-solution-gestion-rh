import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';
import { chartColors } from '../../charts/ChartjsConfig';
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function GenderContractChart() {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Données de répartition hommes/femmes par type de contrat
  const genderContractData = {
    labels: ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'],
    datasets: [
      {
        label: 'Hommes',
        data: [45, 12, 8, 15, 6],
        backgroundColor: adjustColorOpacity(getCssVariable('--color-blue-500'), 0.8),
        borderColor: getCssVariable('--color-blue-500'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Femmes',
        data: [52, 18, 12, 22, 4],
        backgroundColor: adjustColorOpacity(getCssVariable('--color-pink-500'), 0.8),
        borderColor: getCssVariable('--color-pink-500'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: genderContractData,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
            ticks: {
              maxTicksLimit: 5,
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
          x: {
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 20,
              color: darkMode ? textColor.dark : textColor.light,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12,
                weight: '500'
              }
            },
          },
          tooltip: {
            titleFont: {
              weight: 600,
            },
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y} employés`,
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
          duration: 750,
          easing: 'easeInOutQuart',
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
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.legend.labels.color = textColor.dark;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.legend.labels.color = textColor.light;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme, chart]);

  // Calculer les statistiques
  const totalHommes = genderContractData.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalFemmes = genderContractData.datasets[1].data.reduce((a, b) => a + b, 0);
  const totalEmployes = totalHommes + totalFemmes;
  const pourcentageHommes = ((totalHommes / totalEmployes) * 100).toFixed(1);
  const pourcentageFemmes = ((totalFemmes / totalEmployes) * 100).toFixed(1);

  return (
    <div className="flex flex-col">
      <div className="grow">
        <canvas ref={canvas} width={595} height={248}></canvas>
      </div>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Hommes: <span className="font-medium text-gray-800 dark:text-gray-100">{totalHommes}</span> ({pourcentageHommes}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Femmes: <span className="font-medium text-gray-800 dark:text-gray-100">{totalFemmes}</span> ({pourcentageFemmes}%)
              </span>
            </div>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Total: <span className="font-medium text-gray-800 dark:text-gray-100">{totalEmployes} employés</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenderContractChart; 