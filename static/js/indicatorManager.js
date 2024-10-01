// indicatorManager.js

import { calculateMACD } from './indicators/macd.js';
import { calculateUTBotAlerts } from './indicators/utBotAlerts.js';

let activeIndicators = [];

export function addIndicator(type, params) {
    activeIndicators.push({ type, params });
}

export function removeIndicator(type) {
    activeIndicators = activeIndicators.filter(ind => ind.type !== type);
}

export function getActiveIndicators() {
    return activeIndicators;
}

export function clearActiveIndicators() {
    activeIndicators = [];
}

export function initializeIndicators(chart, candleSeries) {
    activeIndicators.forEach(indicator => {
        switch(indicator.type) {
            case 'MACD':
                const macd = calculateMACD(candleSeries.data(), indicator.params.fastLen, indicator.params.slowLen, indicator.params.sigLen);
                renderMACD(chart, macd);
                break;
            case 'UTBotAlerts':
                const utBot = calculateUTBotAlerts(candleSeries.data(), indicator.params.a, indicator.params.c);
                renderUTBotAlerts(chart, utBot);
                break;
            // Add more indicators here
            default:
                console.warn(`Indicator type ${indicator.type} not recognized.`);
        }
    });
}

function renderMACD(chart, macdData) {
    const macdLine = chart.addLineSeries({ color: 'blue', lineWidth: 1 });
    macdLine.setData(macdData.macd.map(d => ({ time: d.time, value: d.value })));

    const signalLine = chart.addLineSeries({ color: 'red', lineWidth: 1 });
    signalLine.setData(macdData.signal.map(d => ({ time: d.time, value: d.value })));

    const histogram = chart.addHistogramSeries({ color: 'green', priceScaleId: 'price', priceFormat: { type: 'volume' } });
    histogram.setData(macdData.histogram.map(d => ({ time: d.time, value: d.value })));
}

function renderUTBotAlerts(chart, utBotData) {
    // Implement UTBotAlerts rendering
    // This is a placeholder
}
