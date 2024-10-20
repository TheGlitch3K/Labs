export function initCustomization() {
    initializeContextMenu();
}

function initializeContextMenu() {
    const chartContainer = document.getElementById('candlestick-chart');
    chartContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
}

function showContextMenu(x, y) {
    const contextMenu = document.createElement('div');
    contextMenu.id = 'custom-context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.backgroundColor = '#fff';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.zIndex = 1000;
    contextMenu.innerHTML = `
        <div class="context-menu-item" onclick="showColorPicker()">Change Background Color</div>
    `;
    document.body.appendChild(contextMenu);

    document.addEventListener('click', () => {
        if (contextMenu) {
            contextMenu.remove();
        }
    }, { once: true });
}

function showColorPicker() {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.position = 'absolute';
    colorPicker.style.left = '50%';
    colorPicker.style.top = '50%';
    colorPicker.style.transform = 'translate(-50%, -50%)';
    colorPicker.addEventListener('input', (e) => {
        changeBackgroundColor(e.target.value);
    });
    document.body.appendChild(colorPicker);
    colorPicker.click();
    colorPicker.remove();
}

function changeBackgroundColor(color) {
    const chartContainer = document.getElementById('candlestick-chart');
    chartContainer.style.backgroundColor = color;
    localStorage.setItem('chartBackgroundColor', color);
}

export function loadSavedBackgroundColor() {
    const savedColor = localStorage.getItem('chartBackgroundColor');
    if (savedColor) {
        const chartContainer = document.getElementById('candlestick-chart');
        chartContainer.style.backgroundColor = savedColor;
    }
}
