class Configurations {
    constructor() {
        this.configurations = this.loadConfigurations();
    }

    saveConfiguration(name, config) {
        this.configurations[name] = config;
        this.saveConfigurations();
    }

    loadConfiguration(name) {
        return this.configurations[name] || null;
    }

    deleteConfiguration(name) {
        delete this.configurations[name];
        this.saveConfigurations();
    }

    saveConfigurations() {
        localStorage.setItem('strategyConfigurations', JSON.stringify(this.configurations));
    }

    loadConfigurations() {
        const savedConfigs = localStorage.getItem('strategyConfigurations');
        return savedConfigs ? JSON.parse(savedConfigs) : {};
    }
}

export default new Configurations();
