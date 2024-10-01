let activeIndicators = [];
let nextId = 1;

export function addIndicator(indicator) {
    const newIndicator = { ...indicator, id: nextId++ };
    activeIndicators.push(newIndicator);
    return newIndicator;
}

export function removeIndicator(indicatorId) {
    activeIndicators = activeIndicators.filter(ind => ind.id !== indicatorId);
}

export function getActiveIndicators() {
    return activeIndicators;
}

export function clearActiveIndicators() {
    activeIndicators = [];
    nextId = 1;
}
