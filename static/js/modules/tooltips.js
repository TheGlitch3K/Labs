export function addTooltips() {
    const strategyParams = document.querySelectorAll('#myriadlabs-settings-form label');
    strategyParams.forEach(label => {
        const tooltipText = getTooltipText(label.getAttribute('for'));
        if (tooltipText) {
            label.setAttribute('title', tooltipText);
        }
    });
}

function getTooltipText(param) {
    switch (param) {
        case 'macd-fast-period':
            return 'The number of periods for the fast moving average in the MACD calculation.';
        case 'macd-slow-period':
            return 'The number of periods for the slow moving average in the MACD calculation.';
        case 'macd-signal-period':
            return 'The number of periods for the signal line in the MACD calculation.';
        case 'stop-loss':
            return 'The stop loss level for the strategy.';
        case 'take-profit-1':
            return 'The first take profit level for the strategy.';
        case 'take-profit-2':
            return 'The second take profit level for the strategy.';
        case 'take-profit-3':
            return 'The third take profit level for the strategy.';
        case 'trailing-stop-loss':
            return 'Enable or disable trailing stop loss for the strategy.';
        default:
            return '';
    }
}
