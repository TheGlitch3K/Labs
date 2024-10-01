import { getIndicators, getIndicatorDefaultParams } from './indicatorManager.js';

export function initIndicators() {
    initializeIndicatorsModal();
    initializeActiveIndicatorsList();
}

function initializeIndicatorsModal() {
    const modal = document.getElementById('indicators-modal');
    const btn = document.getElementById('indicators-button');
    const span = document.querySelector('#indicators-modal .close');
    const indicatorsList = document.getElementById('indicators-list');
    const indicatorSearch = document.getElementById('indicator-search');
    const categoryButtons = document.querySelectorAll('#indicator-categories .category-btn');

    if (btn) btn.onclick = () => { if (modal) modal.style.display = 'block'; };
    if (span) span.onclick = () => { if (modal) modal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const indicators = getIndicators();

    function renderIndicators(filteredIndicators) {
        if (indicatorsList) {
            indicatorsList.innerHTML = '';
            filteredIndicators.forEach(indicator => {
                const item = document.createElement('div');
                item.className = 'indicator-item';
                item.innerHTML = `
                    <span>${indicator.name}</span>
                    <button class="add-indicator-btn" data-indicator-id="${indicator.id}">Add</button>
                    <button class="favorite-btn"><i class="far fa-star"></i></button>
                `;
                item.querySelector('.add-indicator-btn').addEventListener('click', (e) => addIndicator(e.target.dataset.indicatorId));
                item.querySelector('.favorite-btn').addEventListener('click', (e) => toggleFavorite(e.target));
                indicatorsList.appendChild(item);
            });
        }
    }

    renderIndicators(indicators);

    if (indicatorSearch) {
        indicatorSearch.addEventListener('input', () => {
            const searchTerm = indicatorSearch.value.toLowerCase();
            const filteredIndicators = indicators.filter(indicator => 
                indicator.name.toLowerCase().includes(searchTerm)
            );
            renderIndicators(filteredIndicators);
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            const filteredIndicators = category === 'all' 
                ? indicators 
                : indicators.filter(indicator => indicator.category === category);
            renderIndicators(filteredIndicators);
        });
    });
}

function addIndicator(indicatorId) {
    console.log(`Adding indicator: ${indicatorId}`);
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        const defaultParams = getIndicatorDefaultParams(indicatorId);
        const newIndicatorId = window.chartFunctions.addChartIndicator(indicatorId, defaultParams);
        if (newIndicatorId !== null) {
            updateActiveIndicatorsList();
        }
    }
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    // Implement the logic to save favorite indicators
}

function initializeActiveIndicatorsList() {
    const activeIndicatorsList = document.getElementById('active-indicators-list');
    if (activeIndicatorsList) {
        activeIndicatorsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-indicator-btn')) {
                const indicatorId = parseInt(e.target.dataset.indicatorId);
                removeIndicator(indicatorId);
            } else if (e.target.classList.contains('settings-indicator-btn')) {
                const indicatorId = parseInt(e.target.dataset.indicatorId);
                window.chartFunctions.showStrategySettings(indicatorId);
            }
        });
    }
    updateActiveIndicatorsList();
}

export function updateActiveIndicatorsList() {
    const activeIndicatorsList = document.getElementById('active-indicators-list');
    if (activeIndicatorsList && window.chartFunctions && window.chartFunctions.getActiveIndicators) {
        const activeIndicators = window.chartFunctions.getActiveIndicators();
        activeIndicatorsList.innerHTML = '';
        activeIndicators.forEach(indicator => {
            const item = document.createElement('div');
            item.className = 'active-indicator-item';
            item.innerHTML = `
                <span>${indicator.type}</span>
                <button class="remove-indicator-btn" data-indicator-id="${indicator.id}">Remove</button>
                ${indicator.type === 'myriadlabs' ? `<button class="settings-indicator-btn" data-indicator-id="${indicator.id}">Settings</button>` : ''}
            `;
            activeIndicatorsList.appendChild(item);
        });
    }
}

function removeIndicator(indicatorId) {
    console.log(`Removing indicator: ${indicatorId}`);
    if (window.chartFunctions && window.chartFunctions.removeChartIndicator) {
        window.chartFunctions.removeChartIndicator(indicatorId);
        updateActiveIndicatorsList();
    }
}
