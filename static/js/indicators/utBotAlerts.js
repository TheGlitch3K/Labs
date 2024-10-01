export function calculateUTBotAlerts(data, a = 1, c = 10) {
    const results = [];
    let xATRTrailingStop = 0;
    let pos = 0;

    for (let i = 0; i < data.length; i++) {
        const src = data[i].close;
        
        // Calculate ATR
        const trueRange = i === 0 ? data[i].high - data[i].low :
            Math.max(data[i].high - data[i].low,
                Math.abs(data[i].high - data[i-1].close),
                Math.abs(data[i].low - data[i-1].close));
        
        const xATR = i < c ? trueRange : (results[i-1].xATR * (c-1) + trueRange) / c;
        const nLoss = a * xATR;

        // Calculate xATRTrailingStop
        if (src > xATRTrailingStop && data[i-1]?.close > xATRTrailingStop) {
            xATRTrailingStop = Math.max(xATRTrailingStop, src - nLoss);
        } else if (src < xATRTrailingStop && data[i-1]?.close < xATRTrailingStop) {
            xATRTrailingStop = Math.min(xATRTrailingStop, src + nLoss);
        } else if (src > xATRTrailingStop) {
            xATRTrailingStop = src - nLoss;
        } else {
            xATRTrailingStop = src + nLoss;
        }

        // Calculate position
        if (data[i-1]?.close < results[i-1]?.xATRTrailingStop && src > xATRTrailingStop) {
            pos = 1;
        } else if (data[i-1]?.close > results[i-1]?.xATRTrailingStop && src < xATRTrailingStop) {
            pos = -1;
        } else {
            pos = results[i-1]?.pos || 0;
        }

        results.push({ time: data[i].time, xATR, xATRTrailingStop, pos });
    }

    return results;
}

export function renderUTBotAlerts(chart, candleSeries, data) {
    const utBotResults = calculateUTBotAlerts(data);
    
    const indicator = chart.addLineSeries({
        color: 'rgba(255, 144, 0, 1)',
        lineWidth: 2,
    });
    
    indicator.setData(utBotResults.map(r => ({
        time: r.time,
        value: r.xATRTrailingStop
    })));

    const buyMarkers = utBotResults.filter(r => r.pos === 1).map(r => ({
        time: r.time,
        position: 'belowBar',
        color: 'green',
        shape: 'arrowUp',
        text: 'Buy'
    }));

    const sellMarkers = utBotResults.filter(r => r.pos === -1).map(r => ({
        time: r.time,
        position: 'aboveBar',
        color: 'red',
        shape: 'arrowDown',
        text: 'Sell'
    }));

    const markers = [...buyMarkers, ...sellMarkers];
    candleSeries.setMarkers(markers);

    return { series: indicator, markers: markers };
}
