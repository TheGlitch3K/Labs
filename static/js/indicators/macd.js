export function calculateMACD(data, fastPeriod, slowPeriod, signalPeriod) {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    
    const macdLine = fastEMA.map((fast, index) => ({
        time: data[index].time,
        value: fast - slowEMA[index]
    }));

    const signalLine = calculateEMA(macdLine, signalPeriod);

    const histogram = macdLine.map((macd, index) => ({
        time: macd.time,
        value: macd.value - signalLine[index].value
    }));

    return {
        macdLine,
        signalLine,
        histogram
    };
}

function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    let ema = [data[0].close];

    for (let i = 1; i < data.length; i++) {
        const newValue = data[i].close * k + ema[i - 1] * (1 - k);
        ema.push(newValue);
    }

    return data.map((candle, index) => ({
        time: candle.time,
        value: ema[index]
    }));
}
