export function calculateMACD(data, fastLength = 12, slowLength = 26, signalLength = 9) {
    const fastEMA = calculateEMA(data, fastLength);
    const slowEMA = calculateEMA(data, slowLength);
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = calculateEMA(macdLine, signalLength);
    const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

    return data.map((_, i) => ({
        macd: macdLine[i],
        signal: signalLine[i],
        histogram: histogram[i]
    }));
}

function calculateEMA(data, length) {
    const k = 2 / (length + 1);
    let ema = [data[0]];

    for (let i = 1; i < data.length; i++) {
        ema[i] = data[i] * k + ema[i - 1] * (1 - k);
    }

    return ema;
}

export function renderMACD(chart, data, params) {
    const { fastLength, slowLength, signalLength } = params;
    const macdData = calculateMACD(data.map(d => d.close), fastLength, slowLength, signalLength);

    const macdSeries = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2,
        priceScaleId: 'macd',
        priceScale: {
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        },
    });

    const signalSeries = chart.addLineSeries({
        color: 'red',
        lineWidth: 2,
        priceScaleId: 'macd',
    });

    const histogramSeries = chart.addHistogramSeries({
        color: 'green',
        priceScaleId: 'macd',
    });

    macdSeries.setData(macdData.map((d, i) => ({ time: data[i].time, value: d.macd })));
    signalSeries.setData(macdData.map((d, i) => ({ time: data[i].time, value: d.signal })));
    histogramSeries.setData(macdData.map((d, i) => ({ time: data[i].time, value: d.histogram })));

    return {
        series: [macdSeries, signalSeries, histogramSeries],
        data: macdData
    };
}
