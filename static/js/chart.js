import { addIndicator, removeIndicator, getActiveIndicators as getActiveIndicatorsFromModule, clearActiveIndicators } from './modules/activeIndicators.js';
import { myriadLabsStrategy, renderMyriadLabsStrategy } from './strategies/myriadLabsStrategy.js';

let chart;
let candleSeries;
let currentSymbol = 'EUR_USD';
let currentTimeframe = 'H1';
let activeDrawingTool = null;
let drawings = [];
let currentDrawing = null;
let drawingStartPoint = null;
let activeStrategy = null;

export function createChart() {
    const chartContainer = document.getElementById('candlestick-chart');
    chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        layout: {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--chart-bg').trim(),
            textColor: getComputedStyle(document.body).getPropertyValue('--text-color').trim(),
        },
        grid: {
            vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
            horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
            timeVisible: true,
            secondsVisible: false,
        },
    });

    candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    });

    chart.subscribeCrosshairMove(param => {
        if (param.time) {
            const data = param.seriesData.get(candleSeries);
            if (data) {
                const symbolInfo = document.getElementById('symbol-info');
                symbolInfo.innerHTML = `O: ${data.open.toFixed(5)} H: ${data.high.toFixed(5)} L: ${data.low.toFixed(5)} C: ${data.close.toFixed(5)}`;
            }
        }
    });

    chart.timeScale().fitContent();

    chartContainer.addEventListener('mousedown', handleMouseDown);
    chartContainer.addEventListener('mousemove', handleMouseMove);
    chartContainer.addEventListener('mouseup', handleMouseUp);
    chartContainer.addEventListener('contextmenu', handleContextMenu);

    fetchLatestData();
}

export function fetchLatestData() {
    fetch(`/api/candlestick_data?symbol=${currentSymbol}&timeframe=${currentTimeframe}&count=1000`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const formattedData = data.map(d => ({
                    time: new Date(d.time).getTime() / 1000,
                    open: parseFloat(d.open),
                    high: parseFloat(d.high),
                    low: parseFloat(d.low),
                    close: parseFloat(d.close)
                }));
                candleSeries.setData(formattedData);
                updateSymbolInfo(currentSymbol, formattedData[formattedData.length - 1]);
                if (activeStrategy) {
                    applyStrategyToChart(activeStrategy);
                }
            }
        })
        .catch(error => console.error('Error fetching candlestick data:', error));
}

function updateSymbolInfo(symbol, lastCandle) {
    const symbolInfo = document.getElementById('symbol-info');
    symbolInfo.innerHTML = `${symbol} O: ${lastCandle.open.toFixed(5)} H: ${lastCandle.high.toFixed(5)} L: ${lastCandle.low.toFixed(5)} C: ${lastCandle.close.toFixed(5)}`;
}

export function switchTimeframe(timeframe) {
    currentTimeframe = timeframe;
    fetchLatestData();
}

export function switchSymbol(symbol) {
    currentSymbol = symbol;
    fetchLatestData();
}

function handleMouseDown(e) {
    if (activeDrawingTool) {
        const coords = chart.timeScale().coordinateToLogical(e.clientX);
        const price = chart.priceScale('right').coordinateToPrice(e.clientY);
        drawingStartPoint = { time: coords, price: price };
    }
}

function handleMouseMove(e) {
    if (activeDrawingTool && drawingStartPoint) {
        const coords = chart.timeScale().coordinateToLogical(e.clientX);
        const price = chart.priceScale('right').coordinateToPrice(e.clientY);

        if (currentDrawing) {
            chart.removeSeries(currentDrawing);
        }

        if (activeDrawingTool === 'trendline') {
            currentDrawing = chart.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
            });
            currentDrawing.setData([
                { time: drawingStartPoint.time, value: drawingStartPoint.price },
                { time: coords, value: price }
            ]);
        } else if (activeDrawingTool === 'horizontalLine') {
            currentDrawing = chart.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
                priceLineVisible: false,
            });
            currentDrawing.setData([
                { time: chart.timeScale().getVisibleLogicalRange().from, value: drawingStartPoint.price },
                { time: chart.timeScale().getVisibleLogicalRange().to, value: drawingStartPoint.price }
            ]);
        }
    }
}

function handleMouseUp(e) {
    if (activeDrawingTool && drawingStartPoint) {
        const coords = chart.timeScale().coordinateToLogical(e.clientX);
        const price = chart.priceScale('right').coordinateToPrice(e.clientY);

        if (currentDrawing) {
            drawings.push(currentDrawing);
            currentDrawing = null;
        }

        drawingStartPoint = null;
    }
}

function handleContextMenu(e) {
    e.preventDefault();
    showChartContextMenu(e.clientX, e.clientY);
}

function showChartContextMenu(x, y) {
    const contextMenu = document.getElementById('chart-context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    contextMenu.innerHTML = `
        <div class="context-menu-item" onclick="window.chartFunctions.toggleLogScale()">Toggle Log Scale</div>
        <div class="context-menu-item" onclick="window.chartFunctions.showChartSettings()">Chart Settings</div>
        <div class="context-menu-item" onclick="window.chartFunctions.clearAllDrawings()">Clear All Drawings</div>
    `;
}

export function toggleLogScale() {
    const currentScale = chart.priceScale('right').mode();
    chart.priceScale('right').applyOptions({
        mode: currentScale === 0 ? 1 : 0, // 0 for normal, 1 for logarithmic
    });
    hideChartContextMenu();
}

export function showChartSettings() {
    // Implement chart settings dialog
    console.log("Chart settings clicked");
    hideChartContextMenu();
}

export function clearAllDrawings() {
    drawings.forEach(drawing => chart.removeSeries(drawing));
    drawings = [];
    hideChartContextMenu();
}

function hideChartContextMenu() {
    const contextMenu = document.getElementById('chart-context-menu');
    contextMenu.style.display = 'none';
}

export function setActiveDrawingTool(tool) {
    activeDrawingTool = tool;
}

export function getLastPrice() {
    const seriesData = candleSeries.data();
    if (seriesData.length > 0) {
        return seriesData[seriesData.length - 1].close;
    }
    return null;
}

export function addChartIndicator(type, params = {}) {
    let indicator;
    switch (type) {
        case 'sma':
            indicator = chart.addLineSeries({
                color: 'rgba(4, 111, 232, 1)',
                lineWidth: 2,
            });
            // Calculate SMA values
            break;
        case 'ema':
            indicator = chart.addLineSeries({
                color: 'rgba(255, 82, 82, 1)',
                lineWidth: 2,
            });
            // Calculate EMA values
            break;
        // Add more indicator types as needed
    }
    if (indicator) {
        addIndicator({ type, series: indicator, params });
        // Calculate and set data for the indicator
    } else {
        console.error(`Failed to add indicator: ${type}`);
    }
}

export function removeChartIndicator(index) {
    const indicators = getActiveIndicatorsFromModule();
    if (index >= 0 && index < indicators.length) {
        chart.removeSeries(indicators[index].series);
        removeIndicator(indicators[index].id);
    }
}

export function adjustChartSize() {
    const chartContainer = document.getElementById('candlestick-chart');
    chart.applyOptions({
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight
    });
}

export function getActiveIndicators() {
    return getActiveIndicatorsFromModule();
}

export function applyStrategyToChart(strategy, params) {
    activeStrategy = strategy;
    clearActiveIndicators();
    const candles = candleSeries.data();
    if (strategy === 'Myriad Labs Strategy') {
        const strategyResult = renderMyriadLabsStrategy(chart, candleSeries, candles, params);
        // Store the strategy result for later use if needed
        window.currentStrategyResult = strategyResult;
        updatePerformanceTable(strategyResult.trades);
    }
}

function updatePerformanceTable(trades) {
    const performanceMetrics = calculatePerformanceMetrics(trades);
    const performanceTable = document.getElementById('performance-table');
    if (performanceTable) {
        performanceTable.innerHTML = `
            <tr><td>Net Profit</td><td>${performanceMetrics.netProfit.toFixed(2)}</td></tr>
            <tr><td>Total Trades</td><td>${performanceMetrics.totalTrades}</td></tr>
            <tr><td>Win Rate</td><td>${performanceMetrics.winRate.toFixed(2)}%</td></tr>
            <tr><td>Profit Factor</td><td>${performanceMetrics.profitFactor.toFixed(2)}</td></tr>
            <tr><td>Max Drawdown</td><td>${performanceMetrics.maxDrawdown.toFixed(2)}</td></tr>
            <tr><td>Avg Trade</td><td>${performanceMetrics.avgTrade.toFixed(2)}</td></tr>
        `;
    }
}

function calculatePerformanceMetrics(trades) {
    let netProfit = 0;
    let winningTrades = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let maxDrawdown = 0;
    let peak = 0;

    trades.forEach(trade => {
        const profit = trade.exit ? trade.exit - trade.entry : 0;
        netProfit += profit;
        if (profit > 0) {
            winningTrades++;
            totalProfit += profit;
        } else {
            totalLoss -= profit;
        }
        peak = Math.max(peak, netProfit);
        maxDrawdown = Math.max(maxDrawdown, peak - netProfit);
    });

    return {
        netProfit,
        totalTrades: trades.length,
        winRate: (winningTrades / trades.length) * 100,
        profitFactor: totalLoss !== 0 ? totalProfit / totalLoss : Infinity,
        maxDrawdown,
        avgTrade: netProfit / trades.length
    };
}

// Make all exported functions available globally
window.chartFunctions = {
    createChart,
    fetchLatestData,
    switchTimeframe,
    switchSymbol,
    toggleLogScale,
    showChartSettings,
    clearAllDrawings,
    setActiveDrawingTool,
    getLastPrice,
    addChartIndicator,
    removeChartIndicator,
    adjustChartSize,
    getActiveIndicators,
    applyStrategyToChart
};
