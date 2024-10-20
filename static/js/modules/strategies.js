import { myriadLabsStrategy } from '../strategies/myriadLabsStrategy.js';

let strategies = ['Moving Average Crossover', 'RSI Overbought/Oversold', 'MACD Divergence', 'MACD Strategy', 'Myriad Labs Strategy'];
let activeStrategy = null;

export function initStrategies() {
    initializeStrategiesDropdown();
}

function initializeStrategiesDropdown() {
    const dropdown = document.getElementById('strategies-dropdown');
    const dropdownBtn = document.getElementById('strategies-dropdown-btn');

    if (dropdown && dropdownBtn) {
        strategies.forEach(strategy => {
            const button = document.createElement('button');
            button.textContent = strategy;
            button.addEventListener('click', () => selectStrategy(strategy));
            dropdown.appendChild(button);
        });

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }
}

function selectStrategy(strategy) {
    activeStrategy = strategy;
    console.log(`Selected strategy: ${strategy}`);
    applyStrategyToChart(strategy);
}

function applyStrategyToChart(strategy) {
    removeExistingStrategyIndicators();

    switch(strategy) {
        case 'Moving Average Crossover':
            addMovingAverageCrossover();
            break;
        case 'RSI Overbought/Oversold':
            addRSIStrategy();
            break;
        case 'MACD Divergence':
            addMACDDivergence();
            break;
        case 'MACD Strategy':
            addMACDStrategy();
            break;
        case 'Myriad Labs Strategy':
            addMyriadLabsStrategy();
            break;
    }
}

function removeExistingStrategyIndicators() {
    console.log('Removing existing strategy indicators');
    // Implement the logic to remove existing strategy indicators
}

function addMovingAverageCrossover() {
    console.log('Adding Moving Average Crossover strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('sma', { period: 10, color: 'blue' });
        window.chartFunctions.addChartIndicator('sma', { period: 20, color: 'red' });
    }
}

function addRSIStrategy() {
    console.log('Adding RSI Overbought/Oversold strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('rsi', { period: 14, overbought: 70, oversold: 30 });
    }
}

function addMACDDivergence() {
    console.log('Adding MACD Divergence strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }
}

function addMACDStrategy() {
    console.log('Adding MACD Strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }
}

function addMyriadLabsStrategy() {
    console.log('Adding Myriad Labs Strategy');
    const candles = window.chartFunctions.getCandles();
    const params = {
        macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        sl: 10,
        tp1: 20,
        tp2: 30,
        tp3: 40,
        trailingSL: true
    };
    const strategyData = myriadLabsStrategy(candles, params);
    plotStrategyData(strategyData);
}

function plotStrategyData(strategyData) {
    const { macdData, divergences, trades, performanceMetrics } = strategyData;
    plotMACDDivergence(macdData, divergences);
    plotEntryExitPoints(trades);
    plotSLTPLevels(trades);
    plotPerformanceTable(performanceMetrics);
}
