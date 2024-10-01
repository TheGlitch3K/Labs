import { calculateMACD } from '../indicators/macd.js';

/**
 * Initializes the MACD Strategy.
 * @param {Object} chart - The Lightweight Charts chart instance.
 * @param {Object} candleSeries - The candlestick series instance.
 * @param {Object} params - Strategy parameters.
 */
export function initializeMACDStrategy(chart, candleSeries, params) {
    // Initialize Performance Metrics
    let netProfit = 0.0;
    let maxEquity = 0.0;
    let maxDrawdown = 0.0;
    let grossProfit = 0.0;
    let grossLoss = 0.0;
    let totalTradesClosed = 0;
    let winningTrades = 0;
    let avgTrade = 0.0;

    // Fetch candlestick data
    const data = candleSeries.data();

    if (!Array.isArray(data) || data.length === 0) {
        console.error('CandleSeries data is not available or empty.');
        return;
    }

    // Calculate MACD
    const macdData = calculateMACD(data, params.macdFastLen, params.macdSlowLen, params.macdSigLen);

    if (macdData.length === 0) {
        console.error('MACD data could not be calculated.');
        return;
    }

    // Create Performance Table
    let performanceTable = null;
    if (params.show_table) {
        performanceTable = createPerformanceTable(params.table_text_color);
    }

    // Strategy Logic Implementation
    // Example: MACD Crossover Strategy

    // Variables to track position
    let position = null;

    for (let i = 1; i < data.length; i++) {
        const current = data[i];
        const previous = data[i - 1];
        const macdCurrent = macdData[i]?.macd;
        const signalCurrent = macdData[i]?.signal;
        const macdPrevious = macdData[i - 1]?.macd;
        const signalPrevious = macdData[i - 1]?.signal;

        if (macdCurrent === undefined || signalCurrent === undefined || macdPrevious === undefined || signalPrevious === undefined) {
            console.warn(`MACD data missing at index ${i}. Skipping.`);
            continue;
        }

        // Entry condition: MACD crosses above signal
        if (!position && macdPrevious < signalPrevious && macdCurrent > signalCurrent) {
            position = {
                type: 'long',
                entry: current.close,
                sl: current.close - params.maxSlOffset, // Simplified SL
                tp1: current.close + params.tp1Ratio * params.maxSlOffset,
                tp2: current.close + params.tp2Ratio * params.maxSlOffset,
                tp3: current.close + params.tp3Ratio * params.maxSlOffset
            };
            console.log('Long position entered at', current.close);

            // Plot Entry Line (Bullish Divergence)
            plotDivergenceLine(previous.time, previous.close, current.time, current.close, 'bullish');
        }

        // Exit condition: MACD crosses below signal
        if (position && position.type === 'long' && macdPrevious > signalPrevious && macdCurrent < signalCurrent) {
            const profit = current.close - position.entry;
            netProfit += profit;
            totalTradesClosed += 1;
            if (profit > 0) {
                winningTrades += 1;
                grossProfit += profit;
            } else {
                grossLoss -= profit;
            }
            maxEquity = Math.max(maxEquity, netProfit);
            const currentDrawdown = maxEquity - netProfit;
            maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
            avgTrade = totalTradesClosed > 0 ? netProfit / totalTradesClosed : 0;

            console.log('Long position exited at', current.close, 'Profit:', profit);

            // Plot Exit Line (Bullish Divergence)
            plotDivergenceLine(current.time, current.close, previous.time, previous.close, 'bullish');

            position = null;
        }

        // Update Performance Table
        if (performanceTable) {
            updatePerformanceTable(performanceTable, {
                netProfit,
                totalTradesClosed,
                percentProfitable: totalTradesClosed > 0 ? (winningTrades / totalTradesClosed) * 100 : 0,
                profitFactor: grossLoss > 0 ? grossProfit / grossLoss : 0,
                maxDrawdown,
                avgTrade: totalTradesClosed > 0 ? netProfit / totalTradesClosed : 0
            }, params.show_table);
        }
    }
}

/**
 * Creates the Performance Metrics Table.
 * @param {string} textColor - The color of the table text.
 * @returns {Object} - The table element.
 */
function createPerformanceTable(textColor) {
    const table = document.getElementById('performance-metrics');
    if (table) {
        table.style.display = 'block';
        table.style.color = textColor;
    }
    return table;
}

/**
 * Updates the Performance Metrics Table with new data.
 * @param {Object} table - The table element.
 * @param {Object} metrics - The performance metrics.
 * @param {boolean} show - Whether to show the table.
 */
function updatePerformanceTable(table, metrics, show) {
    if (!show || !table) return;

    const netProfitEl = document.getElementById('net-profit');
    const totalTradesEl = document.getElementById('total-trades');
    const percentProfitableEl = document.getElementById('percent-profitable');
    const profitFactorEl = document.getElementById('profit-factor');
    const maxDrawdownEl = document.getElementById('max-drawdown');
    const avgTradeEl = document.getElementById('avg-trade');

    if (netProfitEl) netProfitEl.innerText = metrics.netProfit.toFixed(2);
    if (totalTradesEl) totalTradesEl.innerText = metrics.totalTradesClosed;
    if (percentProfitableEl) percentProfitableEl.innerText = metrics.percentProfitable.toFixed(2) + '%';
    if (profitFactorEl) profitFactorEl.innerText = metrics.profitFactor > 0 ? metrics.profitFactor.toFixed(2) : 'NA';
    if (maxDrawdownEl) maxDrawdownEl.innerText = metrics.maxDrawdown.toFixed(2);
    if (avgTradeEl) avgTradeEl.innerText = metrics.avgTrade.toFixed(2);
}
