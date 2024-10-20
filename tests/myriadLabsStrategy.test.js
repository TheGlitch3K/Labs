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
        sl: 10,
        tp1: 20,
        tp2: 30,
        tp3: 40,
        trailingSL: true
    };

    it('should return strategy data with correct structure', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData).toHaveProperty('macdData');
        expect(strategyData).toHaveProperty('divergences');
        expect(strategyData).toHaveProperty('trades');
        expect(strategyData).toHaveProperty('performanceMetrics');
    });

    it('should detect divergences correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData.divergences.length).toBeGreaterThan(0);
    });

    it('should calculate performance metrics correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData.performanceMetrics).toHaveProperty('netProfit');
        expect(strategyData.performanceMetrics).toHaveProperty('totalTradesClosed');
        expect(strategyData.performanceMetrics).toHaveProperty('percentProfitable');
        expect(strategyData.performanceMetrics).toHaveProperty('profitFactor');
        expect(strategyData.performanceMetrics).toHaveProperty('maxDrawdown');
        expect(strategyData.performanceMetrics).toHaveProperty('averageTrade');
    });
});
