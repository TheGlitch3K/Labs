class StrategyManager {
    constructor() {
        this.strategies = {};
    }

    addStrategy(name, strategy) {
        this.strategies[name] = strategy;
    }

    removeStrategy(name) {
        delete this.strategies[name];
    }

    enableStrategy(name) {
        if (this.strategies[name]) {
            this.strategies[name].enabled = true;
        }
    }

    disableStrategy(name) {
        if (this.strategies[name]) {
            this.strategies[name].enabled = false;
        }
    }

    getStrategy(name) {
        return this.strategies[name] || null;
    }

    getAllStrategies() {
        return this.strategies;
    }
}

export default new StrategyManager();
