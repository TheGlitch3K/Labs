export function initZoomPan() {
    const chartContainer = document.getElementById('candlestick-chart');
    chartContainer.addEventListener('wheel', handleZoom);
    chartContainer.addEventListener('mousedown', handlePanStart);
    chartContainer.addEventListener('mousemove', handlePanMove);
    chartContainer.addEventListener('mouseup', handlePanEnd);
    chartContainer.addEventListener('mouseleave', handlePanEnd);
}

let isPanning = false;
let startX = 0;
let startScrollLeft = 0;

function handleZoom(event) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
        window.chartFunctions.zoomOut();
    } else {
        window.chartFunctions.zoomIn();
    }
}

function handlePanStart(event) {
    isPanning = true;
    startX = event.pageX - chartContainer.offsetLeft;
    startScrollLeft = chartContainer.scrollLeft;
}

function handlePanMove(event) {
    if (!isPanning) return;
    const x = event.pageX - chartContainer.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for faster/slower panning
    chartContainer.scrollLeft = startScrollLeft - walk;
}

function handlePanEnd() {
    isPanning = false;
}
