import { calculateMACD } from '../indicators/macd.js';

export function calculateMACDDivergence(data, params) {
    const { fastLength, slowLength, signalLength, divergenceLength } = params;
    const macdData = calculateMACD(data.map(d => d.close), fastLength, slowLength, signalLength);

    const divergences = [];
    for (let i = divergenceLength; i < data.length; i++) {
        const currentPrice = data[i].close;
        const previousPrice = data[i - divergenceLength].close;
        const currentMACD = macdData[i].histogram;
        const previousMACD = macdData[i - divergenceLength].histogram;

        if (currentPrice > previousPrice && currentMACD < previousMACD) {
            divergences.push({
                type: 'bearish',
                time: data[i].time
            });
        } else if (currentPrice < previousPrice && currentMACD > previousMACD) {
            divergences.push({
                type: 'bullish',
                time: data[i].time
            });
        }
    }

    return divergences;
}

export function renderMACDDivergence(chart, series, data, params) {
    const divergences = calculateMACDDivergence(data, params);
    
    const markers = divergences.map(d => ({
        time: d.time,
        position: d.type === 'bullish' ? 'belowBar' : 'aboveBar',
        color: d.type === 'bullish' ? 'green' : 'red',
        shape: 'circle',
        text: d.type === 'bullish' ? 'Bullish' : 'Bearish'
    }));

    series.setMarkers(markers);

    return { markers };
}
