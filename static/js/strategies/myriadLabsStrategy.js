import { calculateMACD } from '../indicators/macd.js';

export function myriadLabsStrategy(candles, params) {
    const { sltpmode, maxFslOfst, openPosWithMaxSL, tp1Ratio, tp1Share, tp2Ratio, tp2Share, tp3Ratio, tp3Share, moveFwdFSL, macdParams } = params;

    const macdData = calculateMACD(candles, macdParams.fastPeriod, macdParams.slowPeriod, macdParams.signalPeriod);
    const divergenceData = detectDivergences(macdData, candles);

    let trades = [];
    let setup = {
        position_is_long: false,
        position_is_short: false,
        entry_price: null,
        sl: null,
        tp1: null,
        tp2: null,
        tp3: null,
        hh: 0,
        ll: Number.MAX_VALUE,
    };

    for (let i = 1; i < candles.length; i++) {
        const candle = candles[i];
        const prevCandle = candles[i - 1];

        // Check for long entry
        if (!setup.position_is_long && divergenceData[i] === 1 && candle.close > setup.hh) {
            setup.sl = divergenceData.sl;
            if (checkOffset(setup, candle.close, 'long', maxFslOfst, openPosWithMaxSL)) {
                enterTrade(setup, candle, 'long', tp1Ratio, tp2Ratio, tp3Ratio);
                trades.push({ type: 'long', entry: candle.close, time: candle.time, sl: setup.sl, tp1: setup.tp1, tp2: setup.tp2, tp3: setup.tp3 });
            }
        }

        // Check for short entry
        if (!setup.position_is_short && divergenceData[i] === -1 && candle.close < setup.ll) {
            setup.sl = divergenceData.sl;
            if (checkOffset(setup, candle.close, 'short', maxFslOfst, openPosWithMaxSL)) {
                enterTrade(setup, candle, 'short', tp1Ratio, tp2Ratio, tp3Ratio);
                trades.push({ type: 'short', entry: candle.close, time: candle.time, sl: setup.sl, tp1: setup.tp1, tp2: setup.tp2, tp3: setup.tp3 });
            }
        }

        // Manage open trades
        if (setup.position_is_long || setup.position_is_short) {
            if (sltpmode === 'Fixed' && moveFwdFSL) {
                moveFwdFixedSL(setup, candle, tp1Ratio, tp2Ratio, tp3Ratio);
            } else if (sltpmode === 'Trailing') {
                setTrailingStop(setup, candle);
            }
        }

        // Update high/low values
        setup.hh = Math.max(setup.hh, candle.high);
        setup.ll = Math.min(setup.ll, candle.low);
    }

    return {
        macdData,
        divergenceData,
        trades,
        setup
    };
}

function checkOffset(setup, price, direction, maxFslOfst, openPosWithMaxSL) {
    const offset = Math.abs(price - setup.sl) / price * 100;
    if (offset > maxFslOfst) {
        if (openPosWithMaxSL) {
            setup.sl = direction === 'long' ? price * (100 - maxFslOfst) / 100 : price * (100 + maxFslOfst) / 100;
        } else {
            return false;
        }
    }
    setup.position_is_long = direction === 'long';
    setup.position_is_short = direction === 'short';
    return true;
}

function enterTrade(setup, candle, direction, tp1Ratio, tp2Ratio, tp3Ratio) {
    setup.entry_price = candle.close;
    const risk = Math.abs(setup.entry_price - setup.sl);
    setup.tp1 = direction === 'long' ? setup.entry_price + tp1Ratio * risk : setup.entry_price - tp1Ratio * risk;
    setup.tp2 = direction === 'long' ? setup.entry_price + tp2Ratio * risk : setup.entry_price - tp2Ratio * risk;
    setup.tp3 = direction === 'long' ? setup.entry_price + tp3Ratio * risk : setup.entry_price - tp3Ratio * risk;
}

function moveFwdFixedSL(setup, candle, tp1Ratio, tp2Ratio, tp3Ratio) {
    const risk = Math.abs(setup.entry_price - setup.sl);
    if (setup.position_is_long) {
        setup.hh = Math.max(candle.high, setup.hh);
        const rr = Math.floor((setup.hh - setup.entry_price) / risk);
        setup.sl = Math.max(setup.sl, setup.entry_price + (rr - 1) * risk);
    } else if (setup.position_is_short) {
        setup.ll = Math.min(candle.low, setup.ll);
        const rr = Math.floor((setup.entry_price - setup.ll) / risk);
        setup.sl = Math.min(setup.sl, setup.entry_price - (rr - 1) * risk);
    }
}

function setTrailingStop(setup, candle) {
    if (setup.position_is_long) {
        setup.hh = Math.max(candle.high, setup.hh);
        setup.sl = Math.max(setup.sl, setup.hh * (1 - setup.sl / 100));
    } else if (setup.position_is_short) {
        setup.ll = Math.min(candle.low, setup.ll);
        setup.sl = Math.min(setup.sl, setup.ll * (1 + setup.sl / 100));
    }
}

function detectDivergences(macdData, candles) {
    // Implement divergence detection logic here
    // This is a placeholder and should be replaced with actual divergence detection
    return candles.map((_, i) => {
        if (i % 20 === 0) return 1;  // Bullish divergence every 20 candles
        if (i % 30 === 0) return -1; // Bearish divergence every 30 candles
        return 0;
    });
}

export function renderMyriadLabsStrategy(chart, candleSeries, data, params) {
    const strategyResult = myriadLabsStrategy(data, params);
    
    // Render MACD
    const macdSeries = chart.addLineSeries({
        color: 'rgba(255, 82, 82, 1)',
        lineWidth: 2,
        priceScaleId: 'right',
        pane: 1
    });

    const signalSeries = chart.addLineSeries({
        color: 'rgba(0, 150, 136, 1)',
        lineWidth: 2,
        priceScaleId: 'right',
        pane: 1
    });

    const histogramSeries = chart.addHistogramSeries({
        color: 'rgba(128, 128, 128, 0.5)',
        priceScaleId: 'right',
        pane: 1
    });

    macdSeries.setData(strategyResult.macdData.macdLine);
    signalSeries.setData(strategyResult.macdData.signalLine);
    histogramSeries.setData(strategyResult.macdData.histogram);

    // Render trades on the chart
    const markers = strategyResult.trades.map(trade => ({
        time: trade.time,
        position: trade.type === 'long' ? 'belowBar' : 'aboveBar',
        color: trade.type === 'long' ? '#2196F3' : '#FF5252',
        shape: trade.type === 'long' ? 'arrowUp' : 'arrowDown',
        text: trade.type.toUpperCase()
    }));

    candleSeries.setMarkers(markers);

    // Render SL and TP levels
    const slSeries = chart.addLineSeries({
        color: 'rgba(255, 0, 0, 1)',
        lineWidth: 1,
        lineStyle: 2,
        priceScaleId: 'right',
    });

    const tp1Series = chart.addLineSeries({
        color: 'rgba(0, 255, 0, 1)',
        lineWidth: 1,
        lineStyle: 2,
        priceScaleId: 'right',
    });

    slSeries.setData(strategyResult.trades.map(trade => ({ time: trade.time, value: trade.sl })));
    tp1Series.setData(strategyResult.trades.map(trade => ({ time: trade.time, value: trade.tp1 })));

    return {
        macdSeries,
        signalSeries,
        histogramSeries,
        trades: strategyResult.trades,
        markers,
        setup: strategyResult.setup
    };
}
