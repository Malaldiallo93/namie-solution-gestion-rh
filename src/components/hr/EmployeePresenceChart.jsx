import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';
import { chartColors } from '../../charts/ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { adjustColorOpacity, getCssVariable, formatValue } from '../../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function EmployeePresenceChart() {
  const [chart, setChart] = useState(null);
  const [presenceData, setPresenceData] = useState([]);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  // Simulation de données de présence par heure
  useEffect(() => {
    const generatePresenceData = () => {
      const now = new Date();
      const data = [];
      const labels = [];
      
      // Générer 24 points de données (une par heure)
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(now.getHours() - i);
        
        // Simulation de présence (plus élevée pendant les heures de travail)
        let presence = 0;
        const hour = time.getHours();
        if (hour >= 8 && hour <= 18) {
          presence = Math.floor(Math.random() * 30) + 70; // 70-100 pendant les heures de travail
        } else if (hour >= 6 && hour <= 22) {
          presence = Math.floor(Math.random() * 20) + 20; // 20-40 en dehors des heures de travail
        } else {
          presence = Math.floor(Math.random() * 10); // 0-10 la nuit
        }
        
        data.push(presence);
        labels.push(time);
      }
      
      return { data, labels };
    };

    const updateData = () => {
      const { data, labels } = generatePresenceData();
      setPresenceData({ data, labels });
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Mise à jour toutes les minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!presenceData.data || presenceData.data.length === 0) return;

    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: presenceData.labels,
        datasets: [{
          data: presenceData.data,
          fill: true,
          backgroundColor: function(context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) return 'transparent';
            
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, adjustColorOpacity(getCssVariable('--color-blue-500'), 0.2));
            gradient.addColorStop(1, adjustColorOpacity(getCssVariable('--color-blue-500'), 0));
            return gradient;
          },
          borderColor: getCssVariable('--color-blue-500'),
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: getCssVariable('--color-blue-500'),
          pointHoverBackgroundColor: getCssVariable('--color-blue-500'),
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
        }],
      },
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            suggestedMin: 0,
            suggestedMax: 120,
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => `${value}%`,
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'HH:mm',
              unit: 'hour',
              tooltipFormat: 'HH:mm',
              displayFormats: {
                hour: 'HH:mm',
              },
            },
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
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
              label: (context) => `${context.parsed.y}% de présence`,
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
        animation: false,
        maintainAspectRatio: false,
      },
    });
    
    setChart(newChart);
    return () => newChart.destroy();
  }, [presenceData, darkMode]);

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

  return (
    <div className="grow">
      <canvas ref={canvas} width={595} height={248}></canvas>
    </div>
  );
}

export default EmployeePresenceChart; 