import { calculateMACD } from '../indicators/macd.js';

function calculatePivots(data, leftBars, rightBars) {
    let pivotHighs = [];
    let pivotLows = [];

    for (let i = leftBars; i < data.length - rightBars; i++) {
        let isPivotHigh = true;
        let isPivotLow = true;

        for (let j = i - leftBars; j <= i + rightBars; j++) {
            if (j === i) continue;
            if (data[j].high > data[i].high) isPivotHigh = false;
            if (data[j].low < data[i].low) isPivotLow = false;
        }

        if (isPivotHigh) pivotHighs.push({ index: i, value: data[i].high });
        if (isPivotLow) pivotLows.push({ index: i, value: data[i].low });
    }

    return { pivotHighs, pivotLows };
}

function detectDivergence(data, macdData, pivots, lookback, toCheck) {
    let divergences = [];

    for (let i = data.length - 1; i >= lookback; i--) {
        let pricePivots = pivots.pivotLows.filter(p => p.index <= i && p.index > i - lookback);
        let macdPivots = macdData.slice(Math.max(0, i - lookback), i + 1).map((m, index) => ({ 
            index: Math.max(0, i - lookback) + index, 
            value: m && m.histogram ? m.histogram : null 
        }));

        for (let j = 0; j < Math.min(toCheck, pricePivots.length - 1); j++) {
            for (let k = j + 1; k < Math.min(toCheck, pricePivots.length); k++) {
                if (pricePivots[j] && pricePivots[k] && 
                    pricePivots[j].value < pricePivots[k].value && 
                    macdPivots[pricePivots[j].index - (i - lookback)] && 
                    macdPivots[pricePivots[k].index - (i - lookback)] &&
                    macdPivots[pricePivots[j].index - (i - lookback)].value !== null && 
                    macdPivots[pricePivots[k].index - (i - lookback)].value !== null &&
                    macdPivots[pricePivots[j].index - (i - lookback)].value > macdPivots[pricePivots[k].index - (i - lookback)].value) {
                    divergences.push({
                        type: 'bullish',
                        priceStart: pricePivots[k],
                        priceEnd: pricePivots[j],
                        macdStart: macdPivots[pricePivots[k].index - (i - lookback)],
                        macdEnd: macdPivots[pricePivots[j].index - (i - lookback)]
                    });
                }
            }
        }

        pricePivots = pivots.pivotHighs.filter(p => p.index <= i && p.index > i - lookback);

        for (let j = 0; j < Math.min(toCheck, pricePivots.length - 1); j++) {
            for (let k = j + 1; k < Math.min(toCheck, pricePivots.length); k++) {
                if (pricePivots[j] && pricePivots.k && 
                    pricePivots[j].value > pricePivots[k].value && 
                    macdPivots[pricePivots[j].index - (i - lookback)] && 
                    macdPivots[pricePivots[k].index - (i - lookback)] &&
                    macdPivots[pricePivots[j].index - (i - lookback)].value !== null && 
                    macdPivots[pricePivots[k].index - (i - lookback)].value !== null &&
                    macdPivots[pricePivots[j].index - (i - lookback)].value < macdPivots[pricePivots[k].index - (i - lookback)].value) {
                    divergences.push({
                        type: 'bearish',
                        priceStart: pricePivots[k],
                        priceEnd: pricePivots[j],
                        macdStart: macdPivots[pricePivots[k].index - (i - lookback)],
                        macdEnd: macdPivots[pricePivots[j].index - (i - lookback)]
                    });
                }
            }
        }
    }

    return divergences;
}

export function calculateMyriadLabsStrategy(data, params) {
    const {
        showTable, tableTextColor, slTpMode, maxSlOffset, openPosWithMaxSL,
        tp1Ratio, tp1Share, tp2Ratio, tp2Share, tp3Ratio, tp3Share,
        moveFwdFSL, macdSource, macdFastLen, macdSlowLen, macdSigLen,
        divPivotLeftBars, divPivotRightBars, divPivotLookback, divPivotCheck,
        showDivLines, divPosColor, divNegColor
    } = params;

    let results = [];
    let netProfit = 0;
    let maxEquity = 0;
    let maxDrawdown = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let totalTradesClosed = 0;
    let winningTrades = 0;

    const macdData = calculateMACD(data.map(d => d[macdSource]), macdFastLen, macdSlowLen, macdSigLen);
    const pivots = calculatePivots(data, divPivotLeftBars, divPivotRightBars);
    const divergences = detectDivergence(data, macdData, pivots, divPivotLookback, divPivotCheck);

    let position = null;

    for (let i = 0; i < data.length; i++) {
        const candle = data[i];

        if (!position) {
            const bullishDivergence = divergences.find(d => d.type === 'bullish' && d.priceEnd.index === i);
            const bearishDivergence = divergences.find(d => d.type === 'bearish' && d.priceEnd.index === i);

            if (bullishDivergence && candle.close > pivots.pivotHighs[pivots.pivotHighs.length - 1].value) {
                const sl = Math.min(...data.slice(bullishDivergence.priceStart.index, i + 1).map(d => d.low));
                const risk = candle.close - sl;
                position = {
                    type: 'long',
                    entry: candle.close,
                    sl: sl,
                    tp1: candle.close + risk * tp1Ratio,
                    tp2: candle.close + risk * tp2Ratio,
                    tp3: candle.close + risk * tp3Ratio,
                    entryIndex: i
                };
                results.push({ time: candle.time, position: 'long', price: candle.close, sl, tp1: position.tp1, tp2: position.tp2, tp3: position.tp3 });
            } else if (bearishDivergence && candle.close < pivots.pivotLows[pivots.pivotLows.length - 1].value) {
                const sl = Math.max(...data.slice(bearishDivergence.priceStart.index, i + 1).map(d => d.high));
                const risk = sl - candle.close;
                position = {
                    type: 'short',
                    entry: candle.close,
                    sl: sl,
                    tp1: candle.close - risk * tp1Ratio,
                    tp2: candle.close - risk * tp2Ratio,
                    tp3: candle.close - risk * tp3Ratio,
                    entryIndex: i
                };
                results.push({ time: candle.time, position: 'short', price: candle.close, sl, tp1: position.tp1, tp2: position.tp2, tp3: position.tp3 });
            }
        } else {
            if (position.type === 'long') {
                if (candle.low <= position.sl) {
                    const profit = position.sl - position.entry;
                    netProfit += profit;
                    if (profit > 0) {
                        winningTrades++;
                        grossProfit += profit;
                    } else {
                        grossLoss -= profit;
                    }
                    totalTradesClosed++;
                    maxEquity = Math.max(maxEquity, netProfit);
                    maxDrawdown = Math.max(maxDrawdown, maxEquity - netProfit);
                    results.push({ time: candle.time, position: 'close', price: position.sl });
                    position = null;
                } else if (candle.high >= position.tp1) {
                    const profit = position.tp1 - position.entry;
                    netProfit += profit;
                    winningTrades++;
                    grossProfit += profit;
                    totalTradesClosed++;
                    maxEquity = Math.max(maxEquity, netProfit);
                    results.push({ time: candle.time, position: 'close', price: position.tp1 });
                    position = null;
                }
            } else if (position.type === 'short') {
                if (candle.high >= position.sl) {
                    const profit = position.entry - position.sl;
                    netProfit += profit;
                    if (profit > 0) {
                        winningTrades++;
                        grossProfit += profit;
                    } else {
                        grossLoss -= profit;
                    }
                    totalTradesClosed++;
                    maxEquity = Math.max(maxEquity, netProfit);
                    maxDrawdown = Math.max(maxDrawdown, maxEquity - netProfit);
                    results.push({ time: candle.time, position: 'close', price: position.sl });
                    position = null;
                } else if (candle.low <= position.tp1) {
                    const profit = position.entry - position.tp1;
                    netProfit += profit;
                    winningTrades++;
                    grossProfit += profit;
                    totalTradesClosed++;
                    maxEquity = Math.max(maxEquity, netProfit);
                    results.push({ time: candle.time, position: 'close', price: position.tp1 });
                    position = null;
                }
            }

            if (position && slTpMode === 'Trailing') {
                if (position.type === 'long') {
                    position.sl = Math.max(position.sl, candle.low - (candle.high - position.entry) * maxSlOffset / 100);
                } else if (position.type === 'short') {
                    position.sl = Math.min(position.sl, candle.high + (position.entry - candle.low) * maxSlOffset / 100);
                }
            }
        }
    }

    const percentProfitable = totalTradesClosed > 0 ? (winningTrades / totalTradesClosed) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
    const avgTrade = totalTradesClosed > 0 ? netProfit / totalTradesClosed : 0;

    return {
        signals: results,
        performance: {
            netProfit,
            totalTradesClosed,
            percentProfitable,
            profitFactor,
            maxDrawdown,
            avgTrade
        },
        divergences
    };
}

export function renderMyriadLabsStrategy(chart, series, data, params) {
    const results = calculateMyriadLabsStrategy(data, params);

    // Render signals on the chart
    const markers = results.signals.map(signal => ({
        time: signal.time,
        position: signal.position === 'long' ? 'belowBar' : 'aboveBar',
        color: signal.position === 'long' ? 'green' : signal.position === 'short' ? 'red' : 'blue',
        shape: signal.position === 'long' ? 'arrowUp' : signal.position === 'short' ? 'arrowDown' : 'circle',
        text: signal.position.charAt(0).toUpperCase()
    }));

    // Render divergences
    let divergenceSeries = [];
    if (params.showDivLines) {
        results.divergences.forEach(div => {
            const line = chart.addLineSeries({
                color: div.type === 'bullish' ? params.divPosColor : params.divNegColor,
                lineWidth: 1,
                lineStyle: 2,
            });
            line.setData([
                { time: data[div.priceStart.index].time, value: div.priceStart.value },
                { time: data[div.priceEnd.index].time, value: div.priceEnd.value }
            ]);
            divergenceSeries.push(line);
        });
    }

    // Render performance as a label
    if (params.showTable) {
        const performanceLabel = chart.addLineSeries({
            color: params.tableTextColor,
            lineWidth: 0,
            priceScaleId: '',
            priceLineVisible: false,
            lastValueVisible: false,
        });
        const performanceText = `Net Profit: ${results.performance.netProfit.toFixed(2)}
Total Trades: ${results.performance.totalTradesClosed}
Win Rate: ${results.performance.percentProfitable.toFixed(2)}%
Profit Factor: ${results.performance.profitFactor.toFixed(2)}
Max Drawdown: ${results.performance.maxDrawdown.toFixed(2)}
Avg Trade: ${results.performance.avgTrade.toFixed(2)}`;
        performanceLabel.setData([{ time: data[data.length - 1].time, value: data[data.length - 1].high, text: performanceText }]);
        divergenceSeries.push(performanceLabel);
    }

    return {
        series: divergenceSeries,
        markers: markers
    };
}
