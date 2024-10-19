export function initChartControls() {
    initializeTimeframeButtons();
    initializeChartButtons();
    initializeDrawingToolCustomization();
    initializeSaveLoadLayout();
}

function initializeTimeframeButtons() {
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.timeframe-btn[selected]')?.removeAttribute('selected');
            e.target.setAttribute('selected', '');
            window.currentTimeframe = e.target.dataset.timeframe;
            if (window.chartFunctions && window.chartFunctions.switchTimeframe) {
                window.chartFunctions.switchTimeframe(e.target.dataset.timeframe);
            }
        });
    });
}

function initializeChartButtons() {
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.target.closest('.tool-button').dataset.tool;
            if (window.chartFunctions && window.chartFunctions.setActiveDrawingTool) {
                window.chartFunctions.setActiveDrawingTool(tool);
            }
        });
    });
}

function initializeDrawingToolCustomization() {
    const colorPicker = document.getElementById('drawing-tool-color');
    const lineWidthPicker = document.getElementById('drawing-tool-line-width');

    if (colorPicker && lineWidthPicker) {
        colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            if (window.chartFunctions && window.chartFunctions.setDrawingToolColor) {
                window.chartFunctions.setDrawingToolColor(color);
            }
        });

        lineWidthPicker.addEventListener('input', (e) => {
            const lineWidth = e.target.value;
            if (window.chartFunctions && window.chartFunctions.setDrawingToolLineWidth) {
                window.chartFunctions.setDrawingToolLineWidth(lineWidth);
            }
        });
    }
}

function initializeSaveLoadLayout() {
    const saveLayoutButton = document.getElementById('save-layout');
    const loadLayoutButton = document.getElementById('load-layout');

    if (saveLayoutButton && loadLayoutButton) {
        saveLayoutButton.addEventListener('click', () => {
            if (window.chartFunctions && window.chartFunctions.saveChartLayout) {
                window.chartFunctions.saveChartLayout();
            }
        });

        loadLayoutButton.addEventListener('click', () => {
            if (window.chartFunctions && window.chartFunctions.loadChartLayout) {
                window.chartFunctions.loadChartLayout();
            }
        });
    }
}
