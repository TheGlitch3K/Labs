import { initTheme } from './modules/theme.js';
import { initSidebar } from './modules/sidebar.js';
import { initWatchlist } from './modules/watchlist.js';
import { initAIAssistant } from './modules/aiAssistant.js';
import { initStrategies } from './modules/strategies.js';
import { initIndicators } from './modules/indicators.js';
import { initChartControls } from './modules/chartControls.js';
import * as chartFunctions from './chart.js';

// Initialize global variables
window.currentSymbol = 'EUR_USD';
window.currentTimeframe = 'H1';
window.chartFunctions = chartFunctions;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initWatchlist();
    initAIAssistant();
    initStrategies();
    initIndicators();
    initChartControls();

    // Initialize the chart
    if (chartFunctions && typeof chartFunctions.createChart === 'function') {
        chartFunctions.createChart();
    } else {
        console.error('Chart functions not found. Make sure chart.js is loaded correctly.');
    }

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        if (chartFunctions && typeof chartFunctions.adjustChartSize === 'function') {
            chartFunctions.adjustChartSize();
        }
    });

    // Add event listener for MyriadLabs strategy settings
    document.getElementById('apply-myriadlabs-settings').addEventListener('click', () => {
        const macdFastPeriod = parseInt(document.getElementById('macd-fast-period').value);
        const macdSlowPeriod = parseInt(document.getElementById('macd-slow-period').value);
        const macdSignalPeriod = parseInt(document.getElementById('macd-signal-period').value);
        const stopLoss = parseInt(document.getElementById('stop-loss').value);
        const takeProfit1 = parseInt(document.getElementById('take-profit-1').value);
        const takeProfit2 = parseInt(document.getElementById('take-profit-2').value);
        const takeProfit3 = parseInt(document.getElementById('take-profit-3').value);
        const trailingStopLoss = document.getElementById('trailing-stop-loss').checked;

        const params = {
            macdParams: { fastPeriod: macdFastPeriod, slowPeriod: macdSlowPeriod, signalPeriod: macdSignalPeriod },
            sl: stopLoss,
            tp1: takeProfit1,
            tp2: takeProfit2,
            tp3: takeProfit3,
            trailingSL: trailingStopLoss
        };

        chartFunctions.applyStrategyToChart('Myriad Labs Strategy', params);
    });
});
