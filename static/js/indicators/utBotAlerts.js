export function renderUTBotAlerts(chart, candleSeries, data, params) {
    console.log("Rendering UT Bot Alerts");

    const { lookbackPeriod = 14, oversoldLevel = 30, overboughtLevel = 70 } = params;

    // Calculate UT Bot Alerts
    const utBotData = calculateUTBotAlerts(data, lookbackPeriod, oversoldLevel, overboughtLevel);

    // Add UT Bot Alerts to the chart
    const utBotSeries = chart.addLineSeries({
        color: 'rgba(255, 165, 0, 1)',
        lineWidth: 2,
        priceScaleId: 'right',
        pane: 1
    });

    utBotSeries.setData(utBotData);

    // Add overbought and oversold lines
    const overboughtLine = chart.addLineSeries({
        color: 'rgba(255, 0, 0, 0.5)',
        lineWidth: 1,
        priceScaleId: 'right',
        pane: 1
    });

    const oversoldLine = chart.addLineSeries({
        color: 'rgba(0, 255, 0, 0.5)',
        lineWidth: 1,
        priceScaleId: 'right',
        pane: 1
    });

    overboughtLine.setData(utBotData.map(d => ({ time: d.time, value: overboughtLevel })));
    oversoldLine.setData(utBotData.map(d => ({ time: d.time, value: oversoldLevel })));

    // Add markers for buy and sell signals
    const markers = [];
    for (let i = 1; i < utBotData.length; i++) {
        if (utBotData[i - 1].value <= oversoldLevel && utBotData[i].value > oversoldLevel) {
            markers.push({
                time: utBotData[i].time,
                position: 'belowBar',
                color: '#2196F3',
                shape: 'arrowUp',
                text: 'BUY'
            });
        } else if (utBotData[i - 1].value >= overboughtLevel && utBotData[i].value < overboughtLevel) {
            markers.push({
                time: utBotData[i].time,
                position: 'aboveBar',
                color: '#FF5252',
                shape: 'arrowDown',
                text: 'SELL'
            });
        }
    }

    candleSeries.setMarkers(markers);

    return {
        utBotSeries,
        overboughtLine,
        oversoldLine,
        markers
    };
}

function calculateUTBotAlerts(data, lookbackPeriod, oversoldLevel, overboughtLevel) {
    const utBotData = [];
    
    for (let i = 0; i < data.length; i++) {
        if (i < lookbackPeriod) {
            utBotData.push({ time: data[i].time, value: 50 }); // Default value
            continue;
        }

        const closePrices = data.slice(i - lookbackPeriod, i + 1).map(d => d.close);
        const highestHigh = Math.max(...closePrices);
        const lowestLow = Math.min(...closePrices);
        
        const utBotValue = 100 * (data[i].close - lowestLow) / (highestHigh - lowestLow);
        
        utBotData.push({
            time: data[i].time,
            value: utBotValue
        });
    }

    return utBotData;
}
