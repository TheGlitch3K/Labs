let activeIndicators = [];

export function addIndicator(indicator) {
    activeIndicators.push(indicator);
}

export function removeIndicator(indicatorId) {
    activeIndicators = activeIndicators.filter(ind => ind.id !== indicatorId);
}

export function getActiveIndicators() {
    return activeIndicators;
}

export function clearActiveIndicators() {
    activeIndicators = [];
}
