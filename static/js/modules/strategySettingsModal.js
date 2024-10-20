export function showStrategySettingsModal(strategyName, currentParams, onApply) {
    const modal = document.getElementById('myriadlabs-settings-modal');
    const modalTitle = modal.querySelector('h2');
    const form = document.getElementById('myriadlabs-settings-form');
    const applyButton = document.getElementById('apply-myriadlabs-settings');

    modalTitle.textContent = `${strategyName} Settings`;
    form.innerHTML = ''; // Clear existing form fields

    // Create form fields based on currentParams
    for (const [key, value] of Object.entries(currentParams)) {
        const label = document.createElement('label');
        label.textContent = key;
        const input = document.createElement('input');
        input.type = typeof value === 'number' ? 'number' : 'text';
        input.value = value;
        input.name = key;
        form.appendChild(label);
        form.appendChild(input);
    }

    applyButton.onclick = () => {
        const newParams = {};
        new FormData(form).forEach((value, key) => {
            newParams[key] = typeof currentParams[key] === 'number' ? Number(value) : value;
        });
        onApply(newParams);
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

export function hideStrategySettingsModal() {
    // Implementation for hiding the strategy settings modal
    console.log('Hiding strategy settings modal');
    // Add your modal hide logic here
}

export function showStrategySettings(indicatorId) {
    const indicators = getActiveIndicatorsFromModule();
    const indicator = indicators.find(ind => ind.id === indicatorId);
    if (indicator && indicator.type === 'myriadlabs') {
        showStrategySettingsModal('Myriad Labs Strategy', indicator.params, (newParams) => {
            removeChartIndicator(indicatorId);
            addChartIndicator('myriadlabs', newParams);
        });
    }
}

