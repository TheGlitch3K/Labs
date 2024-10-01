export function showStrategySettingsModal(strategy, currentParams, onApply) {
    const modal = document.getElementById('strategy-settings-modal');
    const form = document.getElementById('strategy-settings-form');
    const applyButton = document.getElementById('apply-strategy-settings');

    // Clear previous form content
    form.innerHTML = '';

    // Generate form fields based on strategy parameters
    for (const [key, value] of Object.entries(currentParams)) {
        const label = document.createElement('label');
        label.textContent = key.replace(/([A-Z])/g, ' ').replace(/^./, str => str.toUpperCase());
        
        let input;
        if (typeof value === 'boolean') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = value;
        } else if (typeof value === 'number') {
            input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.step = 'any';
        } else if (typeof value === 'string') {
            if (['Fixed', 'Trailing'].includes(value)) {
                input = document.createElement('select');
                ['Fixed', 'Trailing'].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    optionElement.selected = option === value;
                    input.appendChild(optionElement);
                });
            } else if (key.toLowerCase().includes('color')) {
                input = document.createElement('input');
                input.type = 'color';
                input.value = value;
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.value = value;
            }
        }

        input.id = key;
        input.name = key;

        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.appendChild(label);
        formGroup.appendChild(input);

        form.appendChild(formGroup);
    }

    // Show the modal
    modal.style.display = 'block';

    // Handle apply button click
    applyButton.onclick = () => {
        const newParams = {};
        for (const [key, value] of Object.entries(currentParams)) {
            const input = document.getElementById(key);
            if (typeof value === 'boolean') {
                newParams[key] = input.checked;
            } else if (typeof value === 'number') {
                newParams[key] = parseFloat(input.value);
            } else {
                newParams[key] = input.value;
            }
        }
        onApply(newParams);
        modal.style.display = 'none';
    };

    // Handle close button click
    const closeButton = modal.querySelector('.close');
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
