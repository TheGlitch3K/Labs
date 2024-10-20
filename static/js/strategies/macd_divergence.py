import pandas as pd
import numpy as np

def calculate_macd(data, fast_period=12, slow_period=26, signal_period=9):
    data['ema_fast'] = data['close'].ewm(span=fast_period, adjust=False).mean()
    data['ema_slow'] = data['close'].ewm(span=slow_period, adjust=False).mean()
    data['macd'] = data['ema_fast'] - data['ema_slow']
    data['signal'] = data['macd'].ewm(span=signal_period, adjust=False).mean()
    data['histogram'] = data['macd'] - data['signal']
    return data

def identify_divergences(data):
    divergences = []
    for i in range(1, len(data) - 1):
        if data['macd'][i] > data['macd'][i - 1] and data['macd'][i] > data['macd'][i + 1] and data['close'][i] < data['close'][i - 1] and data['close'][i] < data['close'][i + 1]:
            divergences.append((data.index[i], 'bearish'))
        elif data['macd'][i] < data['macd'][i - 1] and data['macd'][i] < data['macd'][i + 1] and data['close'][i] > data['close'][i - 1] and data['close'][i] > data['close'][i + 1]:
            divergences.append((data.index[i], 'bullish'))
    return divergences

def execute_trade(signal, current_price, stop_loss, take_profit):
    if signal == 'buy':
        entry_price = current_price
        sl_price = entry_price - stop_loss
        tp_price = entry_price + take_profit
        return {'entry': entry_price, 'stop_loss': sl_price, 'take_profit': tp_price, 'type': 'buy'}
    elif signal == 'sell':
        entry_price = current_price
        sl_price = entry_price + stop_loss
        tp_price = entry_price - take_profit
        return {'entry': entry_price, 'stop_loss': sl_price, 'take_profit': tp_price, 'type': 'sell'}
    return None

def macd_divergence_strategy(data, stop_loss=0.001, take_profit=0.002):
    data = calculate_macd(data)
    divergences = identify_divergences(data)
    trades = []
    for divergence in divergences:
        if divergence[1] == 'bullish':
            trade = execute_trade('buy', data['close'][divergence[0]], stop_loss, take_profit)
        elif divergence[1] == 'bearish':
            trade = execute_trade('sell', data['close'][divergence[0]], stop_loss, take_profit)
        if trade:
            trades.append(trade)
    return trades
