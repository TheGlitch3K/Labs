import { calculateMACD, detectDivergences, calculatePerformanceMetrics } from '../modules/indicators.js';
import { sendAlert } from '../modules/pineConnector.js';

export function myriadLabsStrategy(candles, params) {
    const { macdParams, sl, tp1, tp2, tp3, trailingSL } = params;

    // Calculate MACD
    const macdData = calculateMACD(candles, macdParams);

    // Detect divergences
    const divergences = detectDivergences(macdData);

    // Initialize trades and performance metrics
    let trades = [];
    let performanceMetrics = {
        netProfit: 0,
        totalTradesClosed: 0,
        percentProfitable: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        averageTrade: 0
    };

    // Implement trading logic based on divergences
    divergences.forEach(divergence => {
        const { type, start, end } = divergence;
        const price = candles[end].close;

        if (type === 'positive' && price > candles[start].high) {
            // Enter long position
            const trade = {
                entry: price,
                sl: price - sl,
                tp1: price + tp1,
                tp2: price + tp2,
                tp3: price + tp3,
                trailingSL: trailingSL ? price - sl : null,
                status: 'open'
            };
            trades.push(trade);
            sendAlert('long', price);
        } else if (type === 'negative' && price < candles[start].low) {
            // Enter short position
            const trade = {
                entry: price,
                sl: price + sl,
                tp1: price - tp1,
                tp2: price - tp2,
                tp3: price - tp3,
                trailingSL: trailingSL ? price + sl : null,
                status: 'open'
            };
            trades.push(trade);
            sendAlert('short', price);
        }
    });

    // Update performance metrics after each trade
    trades.forEach(trade => {
        if (trade.status === 'closed') {
            performanceMetrics = calculatePerformanceMetrics(trades);
        }
    });

    return {
        macdData,
        divergences,
        trades,
        performanceMetrics
    };
}
