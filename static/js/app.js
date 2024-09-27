import { initTheme } from './modules/theme.js';
import { initSidebar } from './modules/sidebar.js';
import { initWatchlist } from './modules/watchlist.js';
import { initChat } from './modules/chat.js';
import { initStrategies } from './modules/strategies.js';
import { initIndicators } from './modules/indicators.js';
import { initChartControls } from './modules/chartControls.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initWatchlist();
    initChat();
    initStrategies();
    initIndicators();
    initChartControls();

    // Initialize the chart
    if (window.chartFunctions && typeof window.chartFunctions.createChart === 'function') {
        window.chartFunctions.createChart();
    } else {
        console.error('Chart functions not found. Make sure chart.js is loaded correctly.');
    }

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        if (window.chartFunctions && typeof window.chartFunctions.adjustChartSize === 'function') {
            window.chartFunctions.adjustChartSize();
        }
    });
});

// You can add any global functions or variables here if needed
