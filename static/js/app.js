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
        const params = {
            sltpmode: document.getElementById('sltp-mode').value,
            maxFslOfst: parseFloat(document.getElementById('max-sl-offset').value),
            openPosWithMaxSL: document.getElementById('open-pos-with-max-sl').checked,
            tp1Ratio: parseFloat(document.getElementById('tp1-ratio').value),
            tp1Share: parseFloat(document.getElementById('tp1-share').value),
            tp2Ratio: parseFloat(document.getElementById('tp2-ratio').value),
            tp2Share: parseFloat(document.getElementById('tp2-share').value),
            tp3Ratio: parseFloat(document.getElementById('tp3-ratio').value),
            tp3Share: parseFloat(document.getElementById('tp3-share').value),
            moveFwdFSL: document.getElementById('move-fwd-fsl').value === 'Yes',
            macdParams: {
                fastPeriod: parseInt(document.getElementById('macd-fast-period').value),
                slowPeriod: parseInt(document.getElementById('macd-slow-period').value),
                signalPeriod: parseInt(document.getElementById('macd-signal-period').value),
            },
            div_res: document.getElementById('div-res').value,
            div_pivot_src: document.getElementById('div-pivot-src').value,
            div_pivot_leftbars: parseInt(document.getElementById('div-pivot-leftbars').value),
            div_pivot_rightbars: parseInt(document.getElementById('div-pivot-rightbars').value),
            div_pivot_lookBackLen: parseInt(document.getElementById('div-pivot-lookback').value),
            div_pivot_howManyToCheck: parseInt(document.getElementById('div-pivot-check').value),
            div_plot: document.getElementById('div-plot').value === 'Yes',
            div_posColr: document.getElementById('div-pos-color').value,
            div_negColr: document.getElementById('div-neg-color').value
        };

        chartFunctions.applyStrategyToChart('Myriad Labs Strategy', params);
    });
});
