export class UTBotAlerts {
    constructor() {
        this.alerts = [];
    }

    addAlert(condition, message) {
        this.alerts.push({ condition, message });
    }

    checkAlerts(data) {
        const triggeredAlerts = [];
        this.alerts.forEach(alert => {
            if (alert.condition(data)) {
                triggeredAlerts.push(alert.message);
            }
        });
        return triggeredAlerts;
    }

    clearAlerts() {
        this.alerts = [];
    }
}
