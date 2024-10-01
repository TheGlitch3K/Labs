export function calculatePerformanceMetrics(trades) {
    let netProfit = 0.0;
    let maxEquity = 0.0;
    let maxDrawdown = 0.0;
    let grossProfit = 0.0;
    let grossLoss = 0.0;
    let totalTradesClosed = trades.length;
    let winningTrades = 0;
    let avgTrade = 0.0;

    trades.forEach(trade => {
        netProfit += trade.profit;
        if (trade.profit > 0) {
            winningTrades += 1;
            grossProfit += trade.profit;
        } else {
            grossLoss -= trade.profit;
        }
        maxEquity = Math.max(maxEquity, netProfit);
        const currentDrawdown = maxEquity - netProfit;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
    });

    avgTrade = totalTradesClosed > 0 ? netProfit / totalTradesClosed : 0;

    const percentProfitable = totalTradesClosed > 0 ? (winningTrades / totalTradesClosed) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    return {
        netProfit,
        totalTradesClosed,
        percentProfitable,
        profitFactor,
        maxDrawdown,
        avgTrade
    };
}
