export class RSI {
    constructor(period = 14) {
        this.period = period;
    }

    calculate(data) {
        const closes = data.map(d => d.close);
        const gains = [];
        const losses = [];

        for (let i = 1; i < closes.length; i++) {
            const difference = closes[i] - closes[i - 1];
            gains.push(Math.max(difference, 0));
            losses.push(Math.max(-difference, 0));
        }

        const avgGain = this.getAverage(gains.slice(0, this.period));
        const avgLoss = this.getAverage(losses.slice(0, this.period));

        const rsiValues = [100 - (100 / (1 + avgGain / avgLoss))];

        for (let i = this.period; i < closes.length - 1; i++) {
            const gain = gains[i];
            const loss = losses[i];

            const newAvgGain = (avgGain * (this.period - 1) + gain) / this.period;
            const newAvgLoss = (avgLoss * (this.period - 1) + loss) / this.period;

            rsiValues.push(100 - (100 / (1 + newAvgGain / newAvgLoss)));
        }

        return rsiValues;
    }

    getAverage(data) {
        return data.reduce((sum, value) => sum + value, 0) / data.length;
    }
}
