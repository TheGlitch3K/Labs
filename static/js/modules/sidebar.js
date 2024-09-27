export function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        adjustChartSize();
    }
}

function adjustChartSize() {
    const chartContainer = document.getElementById('chart-container');
    const sidebar = document.getElementById('sidebar');
    const watchlistPanel = document.getElementById('watchlist-panel');
   
    if (chartContainer && sidebar && watchlistPanel) {
        const sidebarWidth = sidebar.classList.contains('collapsed') ? 50 : 250;
        const watchlistWidth = watchlistPanel.classList.contains('collapsed') ? 0 : 300;
       
        const newWidth = window.innerWidth - sidebarWidth - watchlistWidth;
        chartContainer.style.width = newWidth + 'px';
       
        if (window.chartFunctions && window.chartFunctions.adjustChartSize) {
            window.chartFunctions.adjustChartSize();
        }
    }
}
