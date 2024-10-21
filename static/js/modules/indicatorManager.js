import { renderUTBotAlerts } from '../indicators/utBotAlerts.js';
import { renderMyriadLabsStrategy } from '../strategies/myriadLabsStrategy.js';

const indicators = {
    utbotalerts: {
        name: 'UT Bot Alerts',
        render: renderUTBotAlerts,
        category: 'trend'
    },
    myriadlabs: {
        name: 'Myriad Labs Strategy',
        render: renderMyriadLabsStrategy,
        category: 'strategy',
        defaultParams: {
            showTable: true,
            tableTextColor: '#ffffff',
            slTpMode: 'Fixed',
            maxSlOffset: 3,
            openPosWithMaxSL: false,
            tp1Ratio: 1,
            tp1Share: 100,
            tp2Ratio: 2,
            tp2Share: 25,
            tp3Ratio: 3,
            tp3Share: 25,
            moveFwdFSL: true,
            macdSource: 'close',
            macdFastLen: 12,
            macdSlowLen: 26,
            macdSigLen: 9,
            divPivotLeftBars: 5,
            divPivotRightBars: 5,
            divPivotLookback: 100,
            divPivotCheck: 10,
            showDivLines: true,
            divPosColor: '#ffeb3b',
            divNegColor: '#ff9800'
        }
    }
};

export function getIndicators() {
    return Object.entries(indicators).map(([id, indicator]) => ({
        id,
        name: indicator.name,
        category: indicator.category
    }));
}

export function renderIndicator(chart, candleSeries, type, params) {
    console.log(`Rendering indicator: ${type}`);
    console.log("Params:", params);
    const indicator = indicators[type];
    if (indicator && indicator.render) {
        const fullParams = { ...indicator.defaultParams, ...params };
        try {
            const result = indicator.render(chart, candleSeries, candleSeries.data(), fullParams);
            console.log("Indicator rendering result:", result);
            return result;
        } catch (error) {
            console.error(`Error rendering indicator ${type}:`, error);
            return null;
        }
    }
    console.error(`Indicator ${type} not found or doesn't have a render function`);
    return null;
}

export function getIndicatorDefaultParams(type) {
    return indicators[type]?.defaultParams || {};
}

export function initIndicators() {
    initializeIndicatorsModal();
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

    const indicatorsArray = getIndicators();

    function renderIndicators(filteredIndicators) {
        if (indicatorsList) {
            indicatorsList.innerHTML = '';
            filteredIndicators.forEach(indicator => {
                const item = document.createElement('div');
                item.className = 'indicator-item';
                item.innerHTML = `
                    <span>${indicator.name}</span>
                    <button class="add-indicator-btn">Add</button>
                    <button class="favorite-btn"><i class="far fa-star"></i></button>
                `;
                item.querySelector('.add-indicator-btn').addEventListener('click', () => addIndicator(indicator.id));
                item.querySelector('.favorite-btn').addEventListener('click', (e) => toggleFavorite(e.target));
                indicatorsList.appendChild(item);
            });
        }
    }

    renderIndicators(indicatorsArray);

    if (indicatorSearch) {
        indicatorSearch.addEventListener('input', () => {
            const searchTerm = indicatorSearch.value.toLowerCase();
            const filteredIndicators = indicatorsArray.filter(indicator => 
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
                ? indicatorsArray 
                : indicatorsArray.filter(indicator => indicator.category === category);
            renderIndicators(filteredIndicators);
        });
    });
}

function addIndicator(indicatorId) {
    console.log(`Adding indicator: ${indicatorId}`);
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator(indicatorId);
    }
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    // Implement the logic to save favorite indicators
}
