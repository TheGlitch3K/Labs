class Backtesting {
    constructor(candles, strategy) {
        this.candles = candles;
        this.strategy = strategy;
        this.trades = [];
        this.performanceMetrics = {};
    }

    run() {
        const strategyData = this.strategy(this.candles);
        this.trades = strategyData.trades;
        this.performanceMetrics = this.calculatePerformanceMetrics();
    }

    calculatePerformanceMetrics() {
        let netProfit = 0;
        let totalTradesClosed = 0;
        let profitableTrades = 0;
        let totalProfit = 0;
        let totalLoss = 0;
        let maxDrawdown = 0;
        let peak = 0;

        this.trades.forEach(trade => {
            if (trade.status === 'closed') {
                totalTradesClosed++;
                const profit = trade.exit - trade.entry;
                netProfit += profit;
                if (profit > 0) {
                    profitableTrades++;
                    totalProfit += profit;
                } else {
                    totalLoss += Math.abs(profit);
                }
                peak = Math.max(peak, netProfit);
                maxDrawdown = Math.max(maxDrawdown, peak - netProfit);
            }
        });

        const percentProfitable = (profitableTrades / totalTradesClosed) * 100;
        const profitFactor = totalProfit / totalLoss;
        const averageTrade = netProfit / totalTradesClosed;

        return {
            netProfit,
            totalTradesClosed,
            percentProfitable,
            profitFactor,
            maxDrawdown,
            averageTrade
        };
    }

    backtest() {
        this.run();
        return {
            trades: this.trades,
            performanceMetrics: this.performanceMetrics
        };
    }
}

export default Backtesting;
