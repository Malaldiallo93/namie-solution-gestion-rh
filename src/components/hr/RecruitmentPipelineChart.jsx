import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';
import { chartColors } from '../../charts/ChartjsConfig';
import apiService from '../../services/api';
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function RecruitmentPipelineChart() {
  const [chart, setChart] = useState(null);
  const [pipelineData, setPipelineData] = useState({
    labels: ['Candidatures', 'Entretiens', 'Offres', 'Embauches'],
    datasets: [{
      label: 'Nombre de candidats',
      data: [0, 0, 0, 0],
      backgroundColor: [
        adjustColorOpacity(getCssVariable('--color-blue-500'), 0.8),
        adjustColorOpacity(getCssVariable('--color-green-500'), 0.8),
        adjustColorOpacity(getCssVariable('--color-yellow-500'), 0.8),
        adjustColorOpacity(getCssVariable('--color-purple-500'), 0.8),
      ],
      borderColor: [
        getCssVariable('--color-blue-500'),
        getCssVariable('--color-green-500'),
        getCssVariable('--color-yellow-500'),
        getCssVariable('--color-purple-500'),
      ],
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }],
  });
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 RecruitmentPipelineChart: Récupération des données...');
        const employees = await apiService.getEmployees();
        
        if (employees && employees.length > 0) {
          // Simulation basée sur le nombre d'employés réels
          const totalEmployees = employees.length;
          const candidatures = Math.round(totalEmployees * 8); // 8 candidatures par embauche
          const entretiens = Math.round(candidatures * 0.3); // 30% passent en entretien
          const offres = Math.round(entretiens * 0.27); // 27% reçoivent une offre
          const embauches = Math.round(offres * 0.67); // 67% acceptent

          setPipelineData({
            labels: ['Candidatures', 'Entretiens', 'Offres', 'Embauches'],
            datasets: [{
              label: 'Nombre de candidats',
              data: [candidatures, entretiens, offres, embauches],
              backgroundColor: [
                adjustColorOpacity(getCssVariable('--color-blue-500'), 0.8),
                adjustColorOpacity(getCssVariable('--color-green-500'), 0.8),
                adjustColorOpacity(getCssVariable('--color-yellow-500'), 0.8),
                adjustColorOpacity(getCssVariable('--color-purple-500'), 0.8),
              ],
              borderColor: [
                getCssVariable('--color-blue-500'),
                getCssVariable('--color-green-500'),
                getCssVariable('--color-yellow-500'),
                getCssVariable('--color-purple-500'),
              ],
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }],
          });
          console.log('✅ RecruitmentPipelineChart: Données mises à jour!');
        }
      } catch (error) {
        console.error('❌ RecruitmentPipelineChart: Erreur:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: pipelineData,
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
            display: false,
          },
          tooltip: {
            titleFont: {
              weight: 600,
            },
            callbacks: {
              label: (context) => `${context.parsed.y} candidats`,
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
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme, chart]);

  // Calculer les taux de conversion
  const conversions = {
    candidatures: pipelineData.datasets[0].data[0],
    entretiens: pipelineData.datasets[0].data[1],
    offres: pipelineData.datasets[0].data[2],
    embauches: pipelineData.datasets[0].data[3],
  };

  const tauxEntretien = ((conversions.entretiens / conversions.candidatures) * 100).toFixed(1);
  const tauxOffre = ((conversions.offres / conversions.entretiens) * 100).toFixed(1);
  const tauxEmbauche = ((conversions.embauches / conversions.offres) * 100).toFixed(1);

  return (
    <div className="flex flex-col">
      <div className="grow">
        <canvas ref={canvas} width={595} height={248}></canvas>
      </div>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Taux d'entretien: <span className="font-medium text-gray-800 dark:text-gray-100">{tauxEntretien}%</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Taux d'offre: <span className="font-medium text-gray-800 dark:text-gray-100">{tauxOffre}%</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Taux d'embauche: <span className="font-medium text-gray-800 dark:text-gray-100">{tauxEmbauche}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruitmentPipelineChart; 