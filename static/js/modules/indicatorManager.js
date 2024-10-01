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
    const indicator = indicators[type];
    if (indicator && indicator.render) {
        const fullParams = { ...indicator.defaultParams, ...params };
        return indicator.render(chart, candleSeries, candleSeries.data(), fullParams);
    }
    console.error(`Indicator ${type} not found or doesn't have a render function`);
    return null;
}

export function getIndicatorDefaultParams(type) {
    return indicators[type]?.defaultParams || {};
}
