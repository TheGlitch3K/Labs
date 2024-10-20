# Myriad Labs Strategy Documentation

## Overview

The Myriad Labs strategy is a comprehensive trading strategy that includes MACD divergence detection, trading logic based on these divergences, and plotting various elements on the chart. This strategy is designed to be used with the Lightweight Charts library and integrates with the existing codebase.

## Features

- **MACD Divergence Detection**: Detects positive and negative divergences in the MACD indicator.
- **Trading Logic**: Enters long positions on positive divergences and short positions on negative divergences.
- **Stop-Loss and Take-Profit**: Implements stop-loss and multiple take-profit levels.
- **Performance Metrics**: Updates and displays performance metrics after each trade.
- **PineConnector Integration**: Sends alerts to MetaTrader using PineConnector.
- **Chart Elements**: Plots MACD indicator, divergence lines, necklines, entry and exit points, SL and TP levels, and labels for breakouts and divergences.

## API Reference

### `myriadLabsStrategy(candles, params)`

#### Parameters

- `candles`: Array of candlestick data.
- `params`: Object containing strategy parameters.
  - `macdParams`: Object containing MACD parameters.
    - `fastPeriod`: Fast period for MACD.
    - `slowPeriod`: Slow period for MACD.
    - `signalPeriod`: Signal period for MACD.
  - `sl`: Stop-loss value.
  - `tp1`: Take-profit level 1.
  - `tp2`: Take-profit level 2.
  - `tp3`: Take-profit level 3.
  - `trailingSL`: Boolean indicating whether to use trailing stop-loss.

#### Returns

- Object containing strategy data.
  - `macdData`: Array of MACD data.
  - `divergences`: Array of detected divergences.
  - `trades`: Array of trade objects.
  - `performanceMetrics`: Object containing performance metrics.

## Usage Example

```javascript
import { myriadLabsStrategy } from './strategies/myriadLabsStrategy.js';

const candles = [
  // Array of candlestick data
];

const params = {
  macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  sl: 10,
  tp1: 20,
  tp2: 30,
  tp3: 40,
  trailingSL: true
};

const strategyData = myriadLabsStrategy(candles, params);
console.log(strategyData);
```

## User Guide

### Adding the Strategy to the Chart

1. Open the chart interface.
2. Select "Myriad Labs Strategy" from the strategies dropdown menu.
3. The strategy will be added to the chart, and the performance table will be displayed in the bottom-left corner.

### Configuring Strategy Parameters

1. Open the "Myriad Labs Strategy Settings" modal.
2. Adjust the MACD parameters, stop-loss, take-profit levels, and trailing stop-loss as needed.
3. Click "Apply Settings" to update the strategy with the new parameters.

### Viewing Performance Metrics

1. The performance table in the bottom-left corner of the chart displays the following metrics:
   - Net Profit
   - Total Trades Closed
   - Percent Profitable
   - Profit Factor
   - Max Drawdown
   - Average Trade

### Sending Alerts to MetaTrader

1. The strategy automatically sends alerts to MetaTrader using PineConnector when a trade is entered.
2. Ensure that PineConnector is properly configured to receive alerts.

## Troubleshooting

- **Strategy Not Appearing in Dropdown**: Ensure that the strategy is listed in `static/js/modules/strategies.js` and that the `addMyriadLabsStrategy` function is properly implemented.
- **Performance Metrics Not Updating**: Check the implementation of the `calculatePerformanceMetrics` function and ensure that it is called after each trade.
- **Alerts Not Sending**: Verify the configuration of PineConnector and ensure that the `sendAlert` function is called when a trade is entered.

## Additional Resources

- [Lightweight Charts Documentation](https://tradingview.github.io/lightweight-charts/)
- [PineConnector Documentation](https://www.pineconnector.com/docs)

## Contact

For further assistance, please contact the Myriad Labs support team at support@myriadlabs.com.
