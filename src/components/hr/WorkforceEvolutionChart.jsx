import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';
import { chartColors } from '../../charts/ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip, Legend,
} from 'chart.js';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function WorkforceEvolutionChart() {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Données d'évolution des effectifs
  const evolutionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Effectifs totaux',
        data: [120, 125, 130, 128, 135, 140],
        borderColor: getCssVariable('--color-green-500'),
        backgroundColor: adjustColorOpacity(getCssVariable('--color-green-500'), 0.1),
        borderWidth: 2,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: getCssVariable('--color-green-500'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointBorderColor: '#ffffff',
        pointHoverBorderColor: '#ffffff',
        tension: 0.2,
      },
      {
        label: 'Nouveaux recrutements',
        data: [5, 8, 12, 6, 10, 15],
        borderColor: getCssVariable('--color-blue-500'),
        backgroundColor: adjustColorOpacity(getCssVariable('--color-blue-500'), 0.1),
        borderWidth: 2,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: getCssVariable('--color-blue-500'),
        pointHoverBackgroundColor: getCssVariable('--color-blue-500'),
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointBorderColor: '#ffffff',
        pointHoverBorderColor: '#ffffff',
        tension: 0.2,
      },
    ],
  };

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: evolutionData,
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
          mode: 'nearest',
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

  // Calculer la croissance
  const currentEffectifs = evolutionData.datasets[0].data[evolutionData.datasets[0].data.length - 1];
  const previousEffectifs = evolutionData.datasets[0].data[evolutionData.datasets[0].data.length - 2];
  const croissance = ((currentEffectifs - previousEffectifs) / previousEffectifs * 100).toFixed(1);

  return (
    <div className="flex flex-col">
      <div className="grow">
        <canvas ref={canvas} width={595} height={248}></canvas>
      </div>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Effectifs actuels: <span className="font-medium text-gray-800 dark:text-gray-100">{currentEffectifs}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Croissance: <span className={`font-medium ${croissance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {croissance >= 0 ? '+' : ''}{croissance}%
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Nouveaux ce mois: <span className="font-medium text-gray-800 dark:text-gray-100">
              {evolutionData.datasets[1].data[evolutionData.datasets[1].data.length - 1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkforceEvolutionChart; 