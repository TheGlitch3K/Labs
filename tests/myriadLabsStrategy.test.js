import { myriadLabsStrategy } from '../static/js/strategies/myriadLabsStrategy';

describe('Myriad Labs Strategy', () => {
    const sampleCandles = [
        { time: 1, open: 1.1, high: 1.2, low: 1.0, close: 1.15 },
        { time: 2, open: 1.15, high: 1.25, low: 1.1, close: 1.2 },
        { time: 3, open: 1.2, high: 1.3, low: 1.15, close: 1.25 },
        { time: 4, open: 1.25, high: 1.35, low: 1.2, close: 1.3 },
        { time: 5, open: 1.3, high: 1.4, low: 1.25, close: 1.35 },
        { time: 6, open: 1.35, high: 1.45, low: 1.3, close: 1.4 },
        { time: 7, open: 1.4, high: 1.5, low: 1.35, close: 1.45 },
        { time: 8, open: 1.45, high: 1.55, low: 1.4, close: 1.5 },
        { time: 9, open: 1.5, high: 1.6, low: 1.45, close: 1.55 },
        { time: 10, open: 1.55, high: 1.65, low: 1.5, close: 1.6 }
    ];

    const params = {
        macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        sltpmode: 'Fixed',
        maxFslOfst: 3,
        openPosWithMaxSL: false,
        tp1Ratio: 1,
        tp1Share: 100,
        tp2Ratio: 2,
        tp2Share: 25,
        tp3Ratio: 3,
        tp3Share: 25,
        moveFwdFSL: true
    };

    it('should return strategy data with correct structure', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData).toHaveProperty('macdData');
        expect(strategyData).toHaveProperty('divergenceData');
        expect(strategyData).toHaveProperty('trades');
        expect(strategyData).toHaveProperty('setup');
    });

    it('should detect divergences correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData.divergenceData.length).toBeGreaterThan(0);
    });

    it('should calculate performance metrics correctly', () => {
        const trades = [
            { entry: 1.15, exit: 1.2 },
            { entry: 1.2, exit: 1.25 },
            { entry: 1.25, exit: 1.3 },
            { entry: 1.3, exit: 1.35 },
            { entry: 1.35, exit: 1.4 }
        ];
        const performanceMetrics = calculatePerformanceMetrics(trades);
        expect(performanceMetrics).toHaveProperty('netProfit');
        expect(performanceMetrics).toHaveProperty('totalTradesClosed');
        expect(performanceMetrics).toHaveProperty('percentProfitable');
        expect(performanceMetrics).toHaveProperty('profitFactor');
        expect(performanceMetrics).toHaveProperty('maxDrawdown');
        expect(performanceMetrics).toHaveProperty('avgTrade');
    });

    it('should handle trade execution correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        const trades = strategyData.trades;
        expect(trades.length).toBeGreaterThan(0);
        trades.forEach(trade => {
            expect(trade).toHaveProperty('entry');
            expect(trade).toHaveProperty('sl');
            expect(trade).toHaveProperty('tp1');
            expect(trade).toHaveProperty('tp2');
            expect(trade).toHaveProperty('tp3');
        });
    });

    it('should manage strategy parameters correctly', () => {
        const updatedParams = { ...params, tp1Ratio: 1.5, tp2Ratio: 2.5, tp3Ratio: 3.5 };
        const strategyData = myriadLabsStrategy(sampleCandles, updatedParams);
        expect(strategyData.setup.tp1).toBeCloseTo(1.15 + 1.5 * (1.15 - strategyData.setup.sl));
        expect(strategyData.setup.tp2).toBeCloseTo(1.15 + 2.5 * (1.15 - strategyData.setup.sl));
        expect(strategyData.setup.tp3).toBeCloseTo(1.15 + 3.5 * (1.15 - strategyData.setup.sl));
    });
});
