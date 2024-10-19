import { ema } from '../utils/indicators.js';

export function macdDivergence(chart, series, params = {}) {
    console.log('Initializing MACD Divergence indicator');
    const { fastLength = 12, slowLength = 26, signalLength = 9 } = params;

    let data = series.data();
    console.log(`Calculating MACD for ${data.length} data points`);
    let macdData = calculateMACD(data, fastLength, slowLength, signalLength);
    let divergences = findDivergences(data, macdData);

    // Create MACD series
    const macdSeries = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2,
        priceScaleId: 'macd',
        pane: 1,
    });

    const signalSeries = chart.addLineSeries({
        color: 'red',
        lineWidth: 1,
        priceScaleId: 'macd',
        pane: 1,
    });

    const histogramSeries = chart.addHistogramSeries({
        color: 'green',
        priceScaleId: 'macd',
        pane: 1,
    });

    console.log('Setting MACD data to series');
    macdSeries.setData(macdData.map(d => ({ time: d.time, value: d.macd })));
    signalSeries.setData(macdData.map(d => ({ time: d.time, value: d.signal })));
    histogramSeries.setData(macdData.map(d => ({ time: d.time, value: d.histogram })));

    // Draw divergence lines
    console.log(`Drawing ${divergences.length} divergences`);
    const divergenceLines = drawDivergences(chart, divergences);

    return {
        series: [macdSeries, signalSeries, histogramSeries, ...divergenceLines],
        destroy: () => {
            console.log('Destroying MACD Divergence indicator');
            chart.removeSeries(macdSeries);
            chart.removeSeries(signalSeries);
            chart.removeSeries(histogramSeries);
            divergenceLines.forEach(line => chart.removeSeries(line));
        },
    };
}

function calculateMACD(data, fastLength, slowLength, signalLength) {
    const closes = data.map(d => d.close);
    const fastEMA = ema(closes, fastLength);
    const slowEMA = ema(closes, slowLength);

    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = ema(macdLine, signalLength);

    return data.map((candle, i) => ({
        time: candle.time,
        macd: macdLine[i] || 0,
        signal: signalLine[i] || 0,
        histogram: (macdLine[i] || 0) - (signalLine[i] || 0),
    }));
}

function findDivergences(priceData, macdData) {
    const divergences = [];
    const lookback = 5;

    for (let i = lookback; i < priceData.length - 1; i++) {
        const priceHigh = Math.max(...priceData.slice(i - lookback, i + 1).map(d => d.high));
        const priceLow = Math.min(...priceData.slice(i - lookback, i + 1).map(d => d.low));
        const macdHigh = Math.max(...macdData.slice(i - lookback, i + 1).map(d => d.histogram));
        const macdLow = Math.min(...macdData.slice(i - lookback, i + 1).map(d => d.histogram));

        if (priceData[i].high === priceHigh && macdData[i].histogram < macdHigh) {
            divergences.push({ type: 'bearish', priceIndex: i, macdIndex: i });
        }

        if (priceData[i].low === priceLow && macdData[i].histogram > macdLow) {
            divergences.push({ type: 'bullish', priceIndex: i, macdIndex: i });
        }
    }

    return divergences;
}

function drawDivergences(chart, divergences) {
    return divergences.map(div => {
        const lineSeries = chart.addLineSeries({
            color: div.type === 'bullish' ? 'green' : 'red',
            lineWidth: 2,
            lineStyle: 2,
        });

        const priceValue = chart.priceScale('right').coordinateToPrice(div.priceIndex);
        const macdValue = chart.priceScale('macd').coordinateToPrice(div.macdIndex);

        if (priceValue !== null && macdValue !== null) {
            lineSeries.setData([
                { time: div.priceIndex, value: priceValue },
                { time: div.macdIndex, value: macdValue },
            ]);
        } else {
            console.warn('Unable to draw divergence line: invalid coordinate conversion');
        }

        return lineSeries;
    });
}