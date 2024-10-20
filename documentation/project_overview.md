
```

## File: ./config/settings.py {#file---config-settings-py}

```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask settings
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')

# API keys
OANDA_API_KEY = os.getenv('OANDA_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Other settings
CANDLESTICK_DATA_COUNT = 1000
DEFAULT_SYMBOL = 'EUR_USD'
DEFAULT_TIMEFRAME = 'H1'
```

## File: ./main.py {#file---main-py}

```python
import os
from flask import Flask
from dotenv import load_dotenv
import logging
from src.routes.main_routes import main_bp
from src.routes.api_routes import api_bp
from src.ai.ai_client import AIClient
from src.data.data_fetcher import OandaDataFetcher

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')

    # Initialize logging
    logging.basicConfig(level=logging.INFO)

    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
    app.config['OANDA_API_KEY'] = os.getenv('OANDA_API_KEY')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

    # Initialize services
    app.data_fetcher = OandaDataFetcher(api_key=app.config['OANDA_API_KEY'])
    app.ai_client = AIClient()

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
```

## File: ./noteToSelf.md {#file---noteToSelf-md}



## File: ./pinescriptIndicator.txt {#file---pinescriptIndicator-txt}

```plaintext
The following strategy needs to be implemented so that I can apply it to the chart in my application.

//Copyright Myriadlabs

//@version=5

///// Table Visibility Input
show_table = input.bool(true, title = "Show Performance Table", group = "Table Settings")

// Input for table text color
table_text_color = input.color(color.white, title = "Table Text Color", group = "Table Settings")


// Create Performance Table
var table performanceTable = table.new(position.bottom_left, 7, 2) // 6 rows and 2 columns for metrics and their values
table.set_bgcolor(performanceTable, color.new(color.gray, 90))
table.set_border_color(performanceTable, color.new(color.white, 90))
table.set_border_width(performanceTable, 1)

// Define strategy variables and metrics
var float net_profit = 0.0
var float max_equity = 0.0
var float max_drawdown = 0.0
var float gross_profit = 0.0
var float gross_loss = 0.0
var int total_trades_closed = 0
var int winning_trades = 0
var float avg_trade = 0.0 // Added this line to declare avg_trade

// Update metrics based on strategy's trade information
if (strategy.position_size[1] != 0 and strategy.position_size == 0) 
    total_trades_closed += 1
    float trade_profit = strategy.closedtrades.profit(strategy.closedtrades-1)
    net_profit += trade_profit
    if trade_profit > 0 
        winning_trades += 1
        gross_profit += trade_profit
    else 
        gross_loss -= trade_profit
    
    max_equity := math.max(max_equity, net_profit)
    float current_drawdown = max_equity - net_profit
    max_drawdown := math.max(max_drawdown, current_drawdown)

    avg_trade := net_profit / total_trades_closed // Calculate average trade

// Calculate derived metrics
float percent_profitable = total_trades_closed > 0 ? (winning_trades / total_trades_closed) * 100 : 0
float profit_factor = gross_loss > 0 ? gross_profit / gross_loss : na


// Populate the table cells with two decimal places formatting
if show_table
    table.cell(performanceTable, 0, 0, "Net Profit")
    table.cell(performanceTable, 0, 1, str.format("{0,number,0.00}", net_profit))
    table.cell(performanceTable, 1, 0, "Total Trades Closed")
    table.cell(performanceTable, 1, 1, str.tostring(total_trades_closed))
    table.cell(performanceTable, 2, 0, "Percent Profitable")
    table.cell(performanceTable, 2, 1, str.format("{0,number,0.00}", percent_profitable) + "%")
    table.cell(performanceTable, 3, 0, "Profit Factor")
    table.cell(performanceTable, 3, 1, na(profit_factor) ? "na" : str.format("{0,number,0.00}", profit_factor))
    table.cell(performanceTable, 4, 0, "Max Drawdown")
    table.cell(performanceTable, 4, 1, str.format("{0,number,0.00}", max_drawdown))
    table.cell(performanceTable, 5, 0, "Avg Trade")
    table.cell(performanceTable, 5, 1, str.format("{0,number,0.00}", avg_trade))

// Apply text color to table cells
    table.cell_set_text_color(performanceTable, 0, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 0, 1, table_text_color)
    table.cell_set_text_color(performanceTable, 1, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 1, 1, table_text_color)
    table.cell_set_text_color(performanceTable, 2, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 2, 1, table_text_color)
    table.cell_set_text_color(performanceTable, 3, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 3, 1, table_text_color)
    table.cell_set_text_color(performanceTable, 4, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 4, 1, table_text_color)
    table.cell_set_text_color(performanceTable, 5, 0, table_text_color)
    table.cell_set_text_color(performanceTable, 5, 1, table_text_color)

strategy("MyriadLabs", overlay = true, max_lines_count = 500, max_labels_count = 500, process_orders_on_close = true, calc_on_order_fills = true)
inx = bar_index


//#region type
//                  Type                    //
type setupx
    bool  position_is_long
    bool  position_is_short
    
    int   entry_time
    int   entry_bar_index
    int   exit_bar_index = 0
    
    float entry_price
    float position_size
    float risk
    float sl
    float tp1
    float tp2
    float tp3
    float hh
    float ll
    float RR

var setup = setupx.new()
//#endregion



//#region input
sltpmode         = input.string('Fixed', title = 'SL & TP Mode', options = ['Fixed', 'Trailing']              , group = 'SL & TP')
maxFslOfst       = input.float (3      , title = 'Max SL Offset%', minval = 0.00001                                  , group = 'SL & TP')
openPosWithMaxSL = input.bool  (false  , title = 'If the Offset Exceeded Max Limit, Open Position with Max SL Offset', group = 'SL & TP')

tp1Ratio = input.float(1,  title = '1.    RR', minval = 0, maxval = 100, inline = '1', group = 'SL & TP')
tp1Share = input.float(100, title = 'Share',    minval = 0, maxval = 100, inline = '1', group = 'SL & TP')
tp2Ratio = input.float(2,  title = '2.    RR', minval = 0, maxval = 100, inline = '2', group = 'SL & TP')
tp2Share = input.float(25, title = 'Share',    minval = 0, maxval = 100, inline = '2', group = 'SL & TP')
tp3Ratio = input.float(3,  title = '3.    RR', minval = 0, maxval = 100, inline = '3', group = 'SL & TP')
tp3Share = input.float(25, title = 'Share',    minval = 0, maxval = 100, inline = '3', group = 'SL & TP')
moveFwdFSL = input.string('No', title = 'Keep Fixed SL One Step Behind the TP', options = ['Yes', 'No'], group = 'SL & TP') == 'Yes'


macdSrc = input.source(close, title = 'Source', group = 'MACD')
macdFastLen = input.int(12, title = 'Fast Length', group = 'MACD')
macdSlowLen = input.int(26, title = 'Slow Length', group = 'MACD')
macdSigLen = input.int(9, title = 'Signal Length', group = 'MACD')


div_res = input.timeframe('240', title = 'Timeframe', group = 'Divergence detector')
div_pivot_src = input.string('Close', title = 'Pivot source', options = ['Close', 'High/Low'], group = 'Divergence detector')
div_pivot_leftbars = input.int(5, title = 'Pivot Left Bars', minval = 1, maxval = 50, group = 'Divergence detector')
div_pivot_rightbars = input.int(5, title = 'Pivot Right Bars', minval = 1, maxval = 50, group = 'Divergence detector')
div_pivot_lookBackLen = input.int(100, title = 'Lookback', minval = 30, maxval = 300, group = 'Divergence detector')
div_pivot_howManyToCheck = input.int(10, title = 'Pivot points to check', minval = 1, maxval = 20, group = 'Divergence detector')
div_plot = input.string('Yes', title = 'Show Divergence Lines', options = ['Yes', 'No'], group = 'Divergence detector') == 'Yes'

div_posColr = input.color(color.new(#ffeb3b, 0), title = 'Positive Regular', inline = 'reg div colr', group = 'Divergence detector')
div_negColr = input.color(color.new(#ff9900, 0), title = 'Negative Regular', inline = 'reg div colr', group = 'Divergence detector')


// alertOnDiv   = input.bool(true, title = 'New Divergence', group = 'Alerts')
// alertOnBreak = input.bool(true, title = 'BreakUp|BreakDown', group = 'Alerts')

// PineConnector Settings
var g_pc        = "PineConnector Settings"
pc_id           = input.string(title="License ID", defval="YOUR_ID", group=g_pc, tooltip="This is your PineConnector license ID")
pc_risk         = input.float(title="Risk Per Trade", defval=1, step=0.5, group=g_pc, tooltip="This is how much to risk per trade (% of balance or lots)")
pc_prefix       = input.string(title="MetaTrader Prefix", defval="", group=g_pc, tooltip="This is your broker's MetaTrader symbol prefix")
pc_suffix       = input.string(title="MetaTrader Suffix", defval="", group=g_pc, tooltip="This is your broker's MetaTrader symbol suffix")

// Generate PineConnector alert string
var symbol = pc_prefix + syminfo.ticker + pc_suffix
pc_entry_alert(direction, sl, tp) =>
    pc_id + "," + direction + "," + symbol + "," + "sl=" + str.tostring(sl) + ",tp=" + str.tostring(tp) + ",risk=" + str.tostring(pc_risk)

//#endregion


//#region function
method entry(setupx this, string msg) =>
    this.entry_time       := time
    this.entry_bar_index  := bar_index
    this.entry_price      := close
    this.risk             := this.entry_price - this.sl
    this.tp1              := this.entry_price + tp1Ratio * this.risk
    if this.position_is_long
        strategy.entry('L.En', strategy.long,  comment = msg)
        // Generate PineConnector alert syntax & Send alert to webhook
        pc_alert = pc_entry_alert("buy", this.sl, this.tp1)
        alert(pc_alert, freq=alert.freq_once_per_bar_close)
    if this.position_is_short
        strategy.entry('S.En', strategy.short, comment = msg)
        // Generate PineConnector alert syntax & Send alert to webhook
        pc_alert = pc_entry_alert("sell", this.sl, this.tp1)
        alert(pc_alert, freq=alert.freq_once_per_bar_close)


method move_fwd_fsl(setupx this) =>
    if bar_index > this.entry_bar_index
        this.tp1 := this.entry_price + tp1Ratio * this.risk
        this.tp2 := this.entry_price + tp2Ratio * this.risk
        this.tp3 := this.entry_price + tp3Ratio * this.risk

        if this.position_is_long
            this.hh := math.max(high, this.hh)
            this.RR := math.floor((this.hh - this.entry_price) / this.risk)
            this.sl := math.max(this.sl, this.entry_price + (this.RR - 1) * this.risk)
            strategy.exit('L.Ex1', 'L.En', stop = this.sl, limit = this.tp1, qty_percent = tp1Share, comment_loss = 'SL', comment_profit = 'TP1')
            strategy.exit('L.Ex2', 'L.En', stop = this.sl, limit = this.tp2, qty_percent = tp2Share, comment_loss = 'SL', comment_profit = 'TP2')
            strategy.exit('L.Ex3', 'L.En', stop = this.sl, limit = this.tp3, qty_percent = tp3Share, comment_loss = 'SL', comment_profit = 'TP3')
        if this.position_is_short
            this.ll := math.min(low, this.ll)
            this.RR := math.floor((this.ll - this.entry_price) / this.risk)
            this.sl := math.min(this.sl, this.entry_price + (this.RR - 1) * this.risk)
            strategy.exit('S.Ex1', 'S.En', stop = this.sl, limit = this.tp1, qty_percent = tp1Share, comment_loss = 'SL', comment_profit = 'TP1')
            strategy.exit('S.Ex2', 'S.En', stop = this.sl, limit = this.tp2, qty_percent = tp2Share, comment_loss = 'SL', comment_profit = 'TP2')
            strategy.exit('S.Ex3', 'S.En', stop = this.sl, limit = this.tp3, qty_percent = tp3Share, comment_loss = 'SL', comment_profit = 'TP3')


method set_tp(setupx this) =>
    if not(strategy.position_size[1] or strategy.position_size)
        this.tp1 := this.entry_price + tp1Ratio * this.risk
        this.tp2 := this.entry_price + tp2Ratio * this.risk
        this.tp3 := this.entry_price + tp3Ratio * this.risk
        if this.position_is_long
            strategy.exit('L.Ex1', 'L.En', stop = this.sl, limit = this.tp1, qty_percent = tp1Share, comment_loss = 'SL', comment_profit = 'TP1')
            strategy.exit('L.Ex2', 'L.En', stop = this.sl, limit = this.tp2, qty_percent = tp2Share, comment_loss = 'SL', comment_profit = 'TP2')
            strategy.exit('L.Ex3', 'L.En', stop = this.sl, limit = this.tp3, qty_percent = tp3Share, comment_loss = 'SL', comment_profit = 'TP3')
        if this.position_is_short
            strategy.exit('S.Ex1', 'S.En', stop = this.sl, limit = this.tp1, qty_percent = tp1Share, comment_loss = 'SL', comment_profit = 'TP1')
            strategy.exit('S.Ex2', 'S.En', stop = this.sl, limit = this.tp2, qty_percent = tp2Share, comment_loss = 'SL', comment_profit = 'TP2')
            strategy.exit('S.Ex3', 'S.En', stop = this.sl, limit = this.tp3, qty_percent = tp3Share, comment_loss = 'SL', comment_profit = 'TP3')


method set_tsl(setupx this) =>
    if bar_index > this.entry_bar_index
        if this.position_is_long
            this.hh := math.max(high, this.hh)
            this.RR := math.floor((this.hh - this.entry_price) / this.risk)
            this.sl := math.max(this.sl, this.entry_price + (this.RR - 1) * this.risk)
            strategy.exit('L.Ex', 'L.En', stop = this.sl, comment_loss = 'SL', comment_profit = 'TP')
        if this.position_is_short
            this.ll := math.min(low, this.ll)
            this.RR := math.floor((this.ll - this.entry_price) / this.risk)
            this.sl := math.min(this.sl, this.entry_price + (this.RR - 1) * this.risk)
            strategy.exit('S.Ex', 'S.En', stop = this.sl, comment_loss = 'SL', comment_profit = 'TP')


method checkOfst(setupx this, string direction) =>
    bool isOK = true
    if math.abs(close - this.sl) / close * 100 > maxFslOfst
        if openPosWithMaxSL
            if direction == 'long'
                this.sl := close * (100 - maxFslOfst) / 100
            else if direction == 'short'
                this.sl := close * (100 + maxFslOfst) / 100
        else
            isOK := false
            this.sl := na
    if isOK
        this.position_is_long  := direction == 'long'
        this.position_is_short := direction == 'short'
    isOK


divdet(bool useHL, int pivLeftBars, int pivRightBars, int pivLBLen, int pivToCheck, float isrc) =>
    //useHL      => use High|Low as pivot source
    //pivLen     => pivot's right & left bars
    //pivLBLen   => allowed range for pivot check
    //pivToCheck => number of pivots to check in the allowed range
    int result = 0
    int x1 = na, int x2 = na
    float y1 = na, float y2 = na
    indMA = ta.sma(isrc, pivLeftBars)//indicator's MA
    
    plsrc = useHL ? low : close
    isPL = ta.pivotlow(plsrc, pivLeftBars, pivRightBars)
    var pl_pos = array.new_int(), var pl_val = array.new_float()
    if isPL
        array.unshift(pl_pos, bar_index[pivRightBars])
        array.unshift(pl_val, plsrc[pivRightBars])
    availPL = array.size(pl_val)
    if availPL >= 2
        if (availPL > pivToCheck) or (bar_index - array.get(pl_pos, availPL - 1) > pivLBLen)
            array.pop(pl_pos), array.pop(pl_val)
            availPL := array.size(pl_val)
    if isPL and availPL >= 2
        for counter = availPL - 1 to 1
            firstPivVal = array.get(pl_val, counter), secondPivVal = array.get(pl_val, 0)
            firstPivInx = array.get(pl_pos, counter), secondPivInx = array.get(pl_pos, 0)
            firstIncVal = isrc[bar_index - firstPivInx], secondIncVal = isrc[pivRightBars]

            if firstPivVal > secondPivVal
                if firstIncVal < secondIncVal
                    pivDis = secondPivInx - firstPivInx
                    pivDif = secondPivVal - firstPivVal
                    pivSlope = pivDif / pivDis
                    incDif = secondIncVal - firstIncVal
                    incSlope = incDif / pivDis
                    for counter = 1 to pivDis
                        if plsrc[counter + pivRightBars] < secondPivVal - pivSlope * counter
                            break
                        if isrc[counter + pivRightBars] * 1 < secondIncVal - incSlope * counter
                            break
                        if counter == pivDis                            
                            if isrc[bar_index - firstPivInx] < indMA[bar_index - firstPivInx - pivRightBars]
                                if isrc[pivRightBars] < indMA
                                    result := 1
                                    x1 := time[pivDis + pivRightBars], x2 := time[pivRightBars]
                                    y1 := plsrc[pivDis + pivRightBars], y2 := plsrc[pivRightBars]
                                    break
            if result
                break
    phsrc = useHL ? high : close
    isPH = ta.pivothigh(phsrc, pivLeftBars, pivRightBars)
    var ph_pos = array.new_int(), var ph_val = array.new_float()
    if isPH
        array.unshift(ph_pos, bar_index[pivRightBars])
        array.unshift(ph_val, phsrc[pivRightBars])
    availPH = array.size(ph_val)
    if availPH >= 2
        if (availPH > pivToCheck) or (bar_index - array.get(ph_pos, availPH - 1) > pivLBLen)
            array.pop(ph_pos), array.pop(ph_val)
            availPH := array.size(ph_val)
    if isPH and availPH >= 2
        for counter = availPH - 1 to 1
            firstPivVal = array.get(ph_val, counter), secondPivVal = array.get(ph_val, 0)
            firstPivInx = array.get(ph_pos, counter), secondPivInx = array.get(ph_pos, 0)
            firstIncVal = isrc[bar_index - firstPivInx], secondIncVal = isrc[pivRightBars]

            if firstPivVal < secondPivVal
                if firstIncVal > secondIncVal
                    pivDis = secondPivInx - firstPivInx
                    pivDif = secondPivVal - firstPivVal
                    pivSlope = pivDif / pivDis
                    incDif = secondIncVal - firstIncVal
                    incSlope = incDif / pivDis
                    for counter = 1 to pivDis
                        if phsrc[counter + pivRightBars] > secondPivVal - pivSlope * counter
                            break
                        if isrc[counter + pivRightBars] * 1 > secondIncVal - incSlope * counter
                            break
                        if counter == pivDis                            
                            if isrc[bar_index - firstPivInx] > indMA[bar_index - firstPivInx - pivRightBars]
                                if isrc[pivRightBars] > indMA
                                    result := -1
                                    x1 := time[pivDis + pivRightBars], x2 := time[pivRightBars]
                                    y1 := phsrc[pivDis + pivRightBars], y2 := phsrc[pivRightBars]
                                    break
            if result
                break
    [result, x1, y1, x2, y2]
//#endregion



//#region computation
var float hh = 0, var float ll = 10e6

int _divx1 = na, int _divx2 = na

var float sl = na

var int divSide = na, var line divLine = na, var label divLabel = na

var line neckLine = na



[macd, macdSig, macdHist] = ta.macd(macdSrc, macdFastLen, macdSlowLen, macdSigLen)

[div_result, divx1, divy1, divx2, divy2] = request.security(syminfo.tickerid, div_res, divdet(div_pivot_src == 'High/Low', div_pivot_leftbars, div_pivot_rightbars, div_pivot_lookBackLen, div_pivot_howManyToCheck, macdHist))



if div_result
    divSide := div_result
    sty  = div_result == 1 ? label.style_label_up : label.style_label_down
    divLine := line.new(divx1, divy1, divx2, divy2, xloc = xloc.bar_time, color = #00000000, width = 2)
    divLabel := label.new(divx2, divy2, xloc = xloc.bar_time, text = 'MACD', color = #00000000, textcolor = #00000000, size = size.small, style = sty)
    hh := 0, ll := 10e6
    sl := divy2
    for i = 0 to 300
        if time[i] == divx2
            _divx2 := inx - i
        if time[i] == divx1
            _divx1 := inx - i
            break

    info = str.format_time(divx1, "MM-dd'T'HH:mm", syminfo.timezone) + '-' + str.format_time(divx2, "MM-dd'T'HH:mm", syminfo.timezone)

    len = _divx2 - _divx1
    if divSide == +1
        for j = inx - _divx2 to inx - _divx1
            hh := math.max(hh, high[j])
        neckLine := line.new(_divx1, hh, _divx2, hh, color = #00000000)
        // if alertOnDiv
        //     alert('New Positive Divergence ' + info, alert.freq_once_per_bar_close)
    if divSide == -1
        for j = inx - _divx2 to inx - _divx1
            ll := math.min(ll, low[j])
        neckLine := line.new(_divx1, ll, _divx2, ll, color = #00000000)
        // if alertOnDiv
        //     alert('New Negative Divergence ' + info, alert.freq_once_per_bar_close)


if divSide == +1
    if low < sl
        divSide := na
        sl := na
        hh := 0, ll := 10e6
if divSide == -1
    if high > sl
        divSide := na
        sl := na
        hh := 0, ll := 10e6
//#endregion



//#region strategy
//                 Strategy                 //
if not strategy.position_size
    setup.entry_price       := na
    setup.entry_time        := na
    setup.sl                := na
    setup.position_is_long  := na
    setup.position_is_short := na
    setup.risk              := na
    setup.tp1               := na
    setup.tp2               := na
    setup.tp3               := na
    setup.hh                := 0
    setup.ll                := 999999
    setup.RR                := na

    if strategy.position_size[1]
        setup.exit_bar_index := bar_index[1]
        hh       := 0
        ll       := 10e6
        neckLine := na
        divSide  := na
        divLine  := na
        divLabel := na

bool longCnd = na, bool shortCnd = na

//-->long
if not(strategy.position_size[1] or strategy.position_size or setup.position_is_long)
    if divSide == +1
        if close > hh
            setup.sl := sl// append the initial SL at the entry time---> setup.sl := close - atrSLOfst
            if setup.checkOfst('long')//checking max sl offset
                setup.entry('Long')
                neckLine.set_x2(inx), neckLine.set_color(div_posColr)
                label.new(inx, neckLine.get_y1(), text = 'Breakup', color = div_posColr, style = label.style_label_left, textcolor = color.black, size = size.small)
                divLine.set_color(div_posColr)
                divLabel.set_color(div_posColr), divLabel.set_textcolor(color.black)
                //if alertOnBreak
                    //alert('Breakup' + '@' + str.tostring(neckLine.get_y1()))

//short
if not(strategy.position_size[1] or strategy.position_size or setup.position_is_short)
    if divSide == -1
        if close < ll
            setup.sl := sl// append the initial SL at the entry time---> setup.sl := close + atrSLOfst
            if setup.checkOfst('short')//checking max sl offset
                setup.entry('Short')
                neckLine.set_x2(inx), neckLine.set_color(div_negColr)
                label.new(inx, neckLine.get_y1(), text = 'Breakdown', color = div_negColr, style = label.style_label_left, textcolor = color.black, size = size.small)
                divLine.set_color(div_negColr)
                divLabel.set_color(div_negColr), divLabel.set_textcolor(color.black)
                //if alertOnBreak
                    //alert('Breakdown' + '@' + str.tostring(neckLine.get_y1()))


//-->SL & TP
bool shwtp2 = true, bool shwtp3 = true
//-->
if tp1Share == 100
    shwtp2 := false
else if tp1Share + tp2Share >= 100
    shwtp3 := false
    tp2Share := 100
else
    tp3Share := 100
//<--

if sltpmode == 'Fixed'
    if moveFwdFSL
        setup.move_fwd_fsl()
    else
        setup.set_tp()

if sltpmode == 'Trailing'
    setup.set_tsl()

//<--SL & TP

//#endregion

plot(setup.sl,  title = 'SL',  style = plot.style_linebr, color = color.red)
plot(setup.tp1, title = 'TP1', style = plot.style_linebr, color = color.aqua)
plot(shwtp2 ? setup.tp2 : na, title = 'TP2', style = plot.style_linebr, color = color.blue)
plot(shwtp3 ? setup.tp3 : na, title = 'TP3', style = plot.style_linebr, color = color.purple)
```

## File: ./requirements.txt {#file---requirements-txt}

```plaintext
Flask==2.3.2
Werkzeug==2.3.6
pandas==1.3.3
requests==2.26.0
python-dotenv==0.19.0
openai==0.27.0```

## File: ./src/ai/ai_client.py {#file---src-ai-ai-client-py}

```python
import os
from openai import OpenAI
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AIClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.system_prompt = (
            "You are an AI assistant specializing in forex trading analysis and strategy.\n"
            "Provide concise, informative responses to trading-related queries.\n"
            "Offer insights on market trends, technical analysis, and risk management,\n"
            "but avoid giving specific financial advice. Always remind users to do their own research\n"
            "and consult with licensed financial advisors for personalized advice.\n"
            "When provided with chart context, use this information to give more accurate and relevant responses.\n"
            "Consider the current symbol, timeframe, price, and active indicators when formulating your answers.\n"
            "You can perform complex analysis and calculations based on the provided data."
        )

    def generate_response(self, prompt, chart_context=None):
        try:
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]
            if chart_context:
                context_message = self.format_chart_context(chart_context)
                messages.append({"role": "user", "content": context_message})
            messages.append({"role": "user", "content": prompt})

            response = self.client.chat.completions.create(
                model="gpt-4o-mini-2024-07-18",  # or "o1-mini-2024-09-12" for o1-mini
                messages=messages,
                max_tokens=500,
                n=1,
                stop=None,
                temperature=0.7,
            )
            message = response.choices[0].message.content.strip()
            logger.info(f"AI response generated successfully")
            return message
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            raise Exception(f"Error generating AI response: {str(e)}")

    def format_chart_context(self, chart_context):
        context_message = "Chart Context:\n"
        context_message += f"Symbol: {chart_context.get('symbol', 'N/A')}\n"
        context_message += f"Timeframe: {chart_context.get('timeframe', 'N/A')}\n"
        context_message += f"Current Price: {chart_context.get('price', 'N/A')}\n"
        
        indicators = chart_context.get('indicators', [])
        if indicators:
            context_message += "Active Indicators:\n"
            for indicator in indicators:
                context_message += f"- {indicator['type']}: {indicator['params']}\n"
        else:
            context_message += "No active indicators\n"
        
        return context_message
```

## File: ./src/ai_client.py {#file---src-ai-client-py}

```python
import openai
import logging

logger = logging.getLogger(__name__)

class AIClient:
    def __init__(self, api_key):
        openai.api_key = api_key
        self.system_prompt = (
            "You are an AI assistant specializing in forex trading analysis and strategy.\n"
            "Provide concise, informative responses to trading-related queries.\n"
            "Offer insights on market trends, technical analysis, and risk management,\n"
            "but avoid giving specific financial advice. Always remind users to do their own research\n"
            "and consult with licensed financial advisors for personalized advice.\n"
            "When provided with chart context, use this information to give more accurate and relevant responses.\n"
            "Consider the current symbol, timeframe, price, and active indicators when formulating your answers."
        )

    def generate_response(self, prompt, chart_context=None):
        try:
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]
            if chart_context:
                context_message = (
                    f"Chart Context:\n"
                    f"Symbol: {chart_context.get('symbol', 'N/A')}\n"
                    f"Timeframe: {chart_context.get('timeframe', 'N/A')}\n"
                    f"Price: {chart_context.get('price', 'N/A')}\n"
                    f"Indicators: {', '.join(chart_context.get('indicators', [])) if chart_context.get('indicators') else 'None'}"
                )
                messages.append({"role": "user", "content": context_message})
            messages.append({"role": "user", "content": prompt})

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=150,
                n=1,
                stop=None,
                temperature=0.7,
            )
            message = response.choices[0].message['content'].strip()
            logger.info(f"AI response generated successfully")
            return message
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            raise Exception(f"Error generating AI response: {str(e)}")
```

## File: ./src/data/data_fetcher.py {#file---src-data-data-fetcher-py}

```python
import requests
import pandas as pd
import logging
import traceback
import threading
import time

logger = logging.getLogger(__name__)

class OandaDataFetcher:
    def __init__(self, api_key):
        self.base_url = "https://api-fxtrade.oanda.com/v3"
        self.api_key = api_key
        if not self.api_key:
            raise ValueError("OANDA API key is not provided. Please provide a valid API key.")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.cache = {}
        self.cache_lock = threading.Lock()
        self.instruments = self._fetch_instruments()
        logger.info("OandaDataFetcher initialized.")

    def _fetch_instruments(self):
        endpoint = f"{self.base_url}/accounts"
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        account_id = response.json()['accounts'][0]['id']
        
        endpoint = f"{self.base_url}/accounts/{account_id}/instruments"
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        return {inst['name']: inst for inst in response.json()['instruments']}

    def fetch_candlestick_data(self, instrument, granularity, count=1000):
        cache_key = f"{instrument}_{granularity}_{count}"
        with self.cache_lock:
            if cache_key in self.cache:
                logger.info(f"Returning cached data for {cache_key}")
                return self.cache[cache_key]

        endpoint = f"{self.base_url}/instruments/{instrument}/candles"
        params = {
            "count": count,
            "granularity": granularity,
            "price": "M"
        }
        try:
            logger.info(f"Fetching candlestick data for {instrument} with granularity {granularity}")
            response = requests.get(endpoint, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            candles = data['candles']
            df = pd.DataFrame(candles)
            df['time'] = pd.to_datetime(df['time'])
            df['open'] = df['mid'].apply(lambda x: float(x['o']))
            df['high'] = df['mid'].apply(lambda x: float(x['h']))
            df['low'] = df['mid'].apply(lambda x: float(x['l']))
            df['close'] = df['mid'].apply(lambda x: float(x['c']))
            df = df[['time', 'open', 'high', 'low', 'close', 'volume']]
            result = df.to_dict(orient='records')

            with self.cache_lock:
                self.cache[cache_key] = result

            logger.info(f"Successfully processed {len(df)} candlesticks")
            return result
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP Error: {e}")
            logger.error(f"Response: {e.response.text}")
            if e.response.status_code == 401:
                raise ValueError("Invalid OANDA API key. Please check your credentials.")
            else:
                raise
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            logger.error(f"Stack trace: {traceback.format_exc()}")
            raise

    def fetch_price_data(self, instrument):
        endpoint = f"{self.base_url}/instruments/{instrument}/candles"
        params = {
            "count": 2,
            "granularity": "M1",
            "price": "M"
        }
        try:
            logger.info(f"Fetching price data for {instrument}")
            response = requests.get(endpoint, headers=self.headers, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            candles = data['candles']
            if len(candles) < 2:
                raise Exception("Not enough data to calculate price change.")
            latest = candles[-1]['mid']
            previous = candles[-2]['mid']
            latest_close = float(latest['c'])
            previous_close = float(previous['c'])
            price_change = ((latest_close - previous_close) / previous_close) * 100
            return {'price': latest_close, 'change': price_change}
        except Exception as e:
            logger.error(f"Error fetching price data: {e}")
            raise

    def search_instruments(self, query, category='all'):
        results = []
        for name, instrument in self.instruments.items():
            if query in name:
                if category == 'all' or category.lower() in instrument['type'].lower():
                    results.append(name)
        return results

    def clear_cache(self):
        with self.cache_lock:
            self.cache.clear()```

## File: ./src/routes/api_routes.py {#file---src-routes-api-routes-py}

```python
from flask import Blueprint, jsonify, request, current_app
from src.data.data_fetcher import OandaDataFetcher
from src.ai.ai_client import AIClient
import json

api_bp = Blueprint('api', __name__)

@api_bp.route('/candlestick_data')
def candlestick_data():
    symbol = request.args.get('symbol', 'EUR_USD')
    timeframe = request.args.get('timeframe', 'H1')
    count = int(request.args.get('count', 1000))
    try:
        data = current_app.data_fetcher.fetch_candlestick_data(instrument=symbol, granularity=timeframe, count=count)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/price_data')
def price_data():
    symbol = request.args.get('symbol', 'EUR_USD')
    try:
        data = current_app.data_fetcher.fetch_price_data(symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/search_instruments')
def search_instruments():
    query = request.args.get('query', '').upper()
    category = request.args.get('category', 'all')
    try:
        instruments = current_app.data_fetcher.search_instruments(query=query, category=category)
        return jsonify(instruments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/ai_chat', methods=['POST'])
def ai_chat():
    data = request.get_json()
    user_input = data.get('message', '')
    chart_context = data.get('chartContext', {})
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    try:
        ai_response = current_app.ai_client.generate_response(prompt=user_input, chart_context=chart_context)
        return jsonify({'response': ai_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/indicators')
def get_indicators():
    # Load indicators from a JSON file
    with open('indicators.json', 'r') as f:
        indicators = json.load(f)
    return jsonify(indicators)

@api_bp.route('/indicators/favorite', methods=['POST'])
def favorite_indicator():
    data = request.get_json()
    indicator_id = data.get('id')
    is_favorite = data.get('isFavorite')
    
    # Load current indicators
    with open('indicators.json', 'r') as f:
        indicators = json.load(f)
    
    # Update the favorite status
    for indicator in indicators:
        if indicator['id'] == indicator_id:
            indicator['isFavorite'] = is_favorite
            break
    
    # Save updated indicators
    with open('indicators.json', 'w') as f:
        json.dump(indicators, f)
    
    return jsonify({'success': True})
```

## File: ./src/routes/main_routes.py {#file---src-routes-main-routes-py}

```python
from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')```

## File: ./static/css/ai-chat.css {#file---static-css-ai-chat-css}

```css
#ai-chat-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--button-bg);
    color: var(--button-text);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
    z-index: 1000;
}

#ai-chat-icon:hover {
    transform: scale(1.1);
}

#ai-chat-panel {
    position: fixed;
    right: -300px;
    bottom: 80px;
    width: 300px;
    height: 400px;
    transition: right 0.3s, height 0.3s;
    display: flex;
    flex-direction: column;
    background-color: var(--ai-chat-bg);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
}

#ai-chat-panel.open {
    right: 20px;
}

#ai-chat-panel.maximized {
    height: calc(100% - 100px);
    width: 400px;
}

#ai-chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--panel-bg);
    border-radius: 10px 10px 0 0;
}

#chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

#chat-input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid var(--border-color);
    background-color: var(--panel-bg);
    border-radius: 0 0 10px 10px;
}

#user-input {
    flex: 1;
    margin-right: 5px;
    padding: 5px;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.chat-message {
    margin-bottom: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    max-width: 80%;
}

.user-message {
    align-self: flex-end;
    background-color: var(--button-bg);
    color: var(--button-text);
}

.ai-message {
    align-self: flex-start;
    background-color: var(--panel-bg);
    color: var(--text-color);
}

@media (max-width: 768px) {
    #ai-chat-panel {
        width: 100%;
        right: -100%;
    }

    #ai-chat-panel.open {
        right: 0;
    }

    #ai-chat-panel.maximized {
        width: 100%;
        height: calc(100% - 80px);
    }
}
```

## File: ./static/css/chart.css {#file---static-css-chart-css}

```css
#chart-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--chart-bg);
}

#chart-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--panel-bg);
}

#timeframe-selector {
    display: flex;
    overflow-x: auto;
    align-items: center;
}

.timeframe-btn {
    background-color: var(--panel-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 5px 10px;
    margin-right: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
}

.timeframe-btn[selected], .timeframe-btn:hover {
    background-color: var(--button-bg);
    color: var(--button-text);
}

#chart-buttons {
    display: flex;
    gap: 10px;
}

.chart-btn {
    background-color: var(--button-bg);
    color: var(--button-text);
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
}

.chart-btn:hover {
    background-color: var(--hover-color);
}

#strategies-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-top: none;
    z-index: 1000;
}

#symbol-info {
    padding: 10px 20px;
    background-color: var(--panel-bg);
    border-top: 1px solid var(--border-color);
}

#candlestick-chart {
    flex: 1;
}

#indicators-button, #strategies-dropdown-btn {
    font-size: 14px;
}

#indicators-button i, #strategies-dropdown-btn i {
    font-size: 16px;
}
```

## File: ./static/css/components.css {#file---static-css-components-css}

```css
.icon-button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    padding: 5px;
    transition: color 0.2s;
}

.icon-button:hover {
    color: var(--button-bg);
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--panel-bg);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    color: var(--text-color);
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {
    background-color: var(--hover-color);
}

.show {
    display: block;
}
```

## File: ./static/css/layout.css {#file---static-css-layout-css}

```css
header {
    background-color: var(--panel-bg);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

main {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.panel {
    width: 300px;
    background-color: var(--panel-bg);
    border-left: 1px solid var(--border-color);
    transition: width 0.3s ease;
}
```

## File: ./static/css/main.css {#file---static-css-main-css}

```css
@import 'variables.css';
@import 'layout.css';
@import 'components.css';
@import 'sidebar.css';
@import 'chart.css';
@import 'watchlist.css';
@import 'ai-chat.css';
@import 'modal.css';
@import 'responsive.css';

/* Global Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
```

## File: ./static/css/modal.css {#file---static-css-modal-css}

```css
.modal {
    display: none;
    position: fixed;
    z-index: 1001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: var(--modal-bg);
    margin: 15% auto;
    padding: 20px;
    border: 1px solid var(--border-color);
    width: 80%;
    max-width: 600px;
    border-radius: 5px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close {
    color: var(--text-color);
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: var(--button-bg);
    text-decoration: none;
    cursor: pointer;
}

#indicator-search {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
    color: var(--text-color);
}

#indicator-categories {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.category-btn {
    background-color: var(--panel-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.category-btn.active {
    background-color: var(--button-bg);
    color: var(--button-text);
}

#indicators-list {
    max-height: 300px;
    overflow-y: auto;
}

.indicator-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
}

.indicator-item:hover {
    background-color: var(--hover-color);
}

.add-indicator-btn, .favorite-btn {
    background-color: var(--button-bg);
    color: var(--button-text);
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.add-indicator-btn:hover, .favorite-btn:hover {
    background-color: var(--hover-color);
}

.favorite-btn {
    background-color: transparent;
    color: var(--text-color);
}

.favorite-btn.active {
    color: gold;
}
```

## File: ./static/css/responsive.css {#file---static-css-responsive-css}

```css
@media (max-width: 768px) {
    main {
        flex-direction: column;
    }

    #sidebar, .panel {
        width: 100%;
        height: auto;
    }

    #sidebar.collapsed {
        height: 50px;
    }

    #ai-chat-panel {
        width: 100%;
        right: -100%;
    }

    #ai-chat-panel.open {
        right: 0;
    }

    .modal-content {
        width: 95%;
        margin: 5% auto;
    }

    #indicator-categories {
        flex-wrap: wrap;
    }

    .category-btn {
        margin-bottom: 5px;
    }

    #timeframe-selector {
        flex-wrap: wrap;
    }

    .timeframe-btn {
        margin-bottom: 5px;
    }

    #chart-container {
        padding: 10px;
    }

    #watchlist-panel {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100%;
        width: 100%;
        z-index: 1000;
        transition: right 0.3s ease;
    }

    #watchlist-panel.open {
        right: 0;
    }

    #watchlist-toggle {
        top: 10px;
        right: 10px;
        transform: none;
    }

    #ai-chat-icon {
        bottom: 10px;
        right: 10px;
    }

    .tool-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 480px) {
    header {
        flex-direction: column;
        align-items: flex-start;
    }

    #theme-toggle {
        margin-top: 10px;
    }

    .tool-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    #indicator-categories {
        flex-direction: column;
    }

    .category-btn {
        width: 100%;
        margin-bottom: 5px;
    }
}
```

## File: ./static/css/sidebar.css {#file---static-css-sidebar-css}

```css
#sidebar {
    width: 250px;
    background-color: var(--panel-bg);
    transition: width 0.3s ease;
    overflow-y: auto;
    padding: 10px;
}

#sidebar.collapsed {
    width: 50px;
}

.tool-category {
    margin-bottom: 20px;
}

.tool-category h3 {
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--text-color);
}

.tool-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}

.tool-button {
    background-color: var(--button-bg);
    color: var(--button-text);
    border: none;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.tool-button i {
    margin-bottom: 5px;
}

.tool-button:hover {
    background-color: var(--hover-color);
}

#indicators-button, #strategies-dropdown-btn {
    grid-column: span 4;
    display: flex;
    justify-content: center;
    align-items: center;
}

#strategies-dropdown {
    display: none;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 5px 0;
    margin-top: 5px;
}

#strategies-dropdown button {
    display: block;
    width: 100%;
    padding: 8px 10px;
    background: none;
    border: none;
    text-align: left;
    color: var(--text-color);
    cursor: pointer;
}

#strategies-dropdown button:hover {
    background-color: var(--hover-color);
}

.show {
    display: block !important;
}
```

## File: ./static/css/variables.css {#file---static-css-variables-css}

```css
:root {
    --bg-color: #131722;
    --text-color: #d1d4dc;
    --border-color: #2a2e39;
    --panel-bg: #1e222d;
    --button-bg: #2962ff;
    --button-text: white;
    --chart-bg: #131722;
    --hover-color: #364156;
    --ai-chat-bg: #1a1e2e;
    --modal-bg: #1e222d;
}

.light-theme {
    --bg-color: #ffffff;
    --text-color: #131722;
    --border-color: #e0e3eb;
    --panel-bg: #f0f3fa;
    --button-bg: #2962ff;
    --button-text: white;
    --chart-bg: #ffffff;
    --hover-color: #e6e9f0;
    --ai-chat-bg: #f5f5f5;
    --modal-bg: #f0f3fa;
}
```

## File: ./static/css/watchlist.css {#file---static-css-watchlist-css}

```css
#watchlist-panel {
    display: flex;
    flex-direction: column;
}

#watchlist-panel h3 {
    padding: 10px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#watchlist-search-container {
    position: relative;
    margin: 10px;
}

#watchlist-search {
    width: 100%;
    padding: 5px;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

#instrument-category-dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    margin-top: 5px;
}

#instrument-category-button {
    width: 100%;
    padding: 5px;
    background-color: var(--panel-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
}

#instrument-category-content {
    display: none;
    position: absolute;
    background-color: var(--panel-bg);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    width: 100%;
}

#instrument-category-content a {
    color: var(--text-color);
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

#instrument-category-content a:hover {
    background-color: var(--hover-color);
}

.show {
    display: block !important;
}

#search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.search-result-item {
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-result-item:hover {
    background-color: var(--hover-color);
}

.search-result-item .add-btn {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1.2em;
    padding: 0 5px;
}

#watchlist-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.watchlist-item {
    padding: 5px 0;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.watchlist-item:hover {
    background-color: var(--hover-color);
}

.watchlist-item .remove-btn {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1.2em;
    padding: 0 5px;
}

#watchlist-toggle {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-right: none;
    border-radius: 5px 0 0 5px;
    padding: 10px 5px;
    z-index: 1000;
    transition: right 0.3s ease;
}

#watchlist-panel.collapsed + #watchlist-toggle {
    right: 300px;
}

#watchlist-panel.collapsed {
    width: 0;
}

#watchlist-context-menu {
    position: absolute;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 5px 0;
    z-index: 1000;
    display: none;
}
```

## File: ./static/js/app.js {#file---static-js-app-js}

```javascript
import { initTheme } from './modules/theme.js';
import { initSidebar } from './modules/sidebar.js';
import { initWatchlist } from './modules/watchlist.js';
import { initAIAssistant } from './modules/aiAssistant.js';
import { initStrategies } from './modules/strategies.js';
import { initIndicators } from './modules/indicators.js';
import { initChartControls } from './modules/chartControls.js';
import * as chartFunctions from './chart.js';

// Initialize global variables
window.currentSymbol = 'EUR_USD';
window.currentTimeframe = 'H1';
window.chartFunctions = chartFunctions;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initWatchlist();
    initAIAssistant();
    initStrategies();
    initIndicators();
    initChartControls();

    // Initialize the chart
    if (chartFunctions && typeof chartFunctions.createChart === 'function') {
        chartFunctions.createChart();
    } else {
        console.error('Chart functions not found. Make sure chart.js is loaded correctly.');
    }

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        if (chartFunctions && typeof chartFunctions.adjustChartSize === 'function') {
            chartFunctions.adjustChartSize();
        }
    });

    // Add event listener for MyriadLabs strategy settings
    document.getElementById('apply-myriadlabs-settings').addEventListener('click', () => {
        const macdFastPeriod = parseInt(document.getElementById('macd-fast-period').value);
        const macdSlowPeriod = parseInt(document.getElementById('macd-slow-period').value);
        const macdSignalPeriod = parseInt(document.getElementById('macd-signal-period').value);
        const stopLoss = parseInt(document.getElementById('stop-loss').value);
        const takeProfit1 = parseInt(document.getElementById('take-profit-1').value);
        const takeProfit2 = parseInt(document.getElementById('take-profit-2').value);
        const takeProfit3 = parseInt(document.getElementById('take-profit-3').value);
        const trailingStopLoss = document.getElementById('trailing-stop-loss').checked;

        const params = {
            macdParams: { fastPeriod: macdFastPeriod, slowPeriod: macdSlowPeriod, signalPeriod: macdSignalPeriod },
            sl: stopLoss,
            tp1: takeProfit1,
            tp2: takeProfit2,
            tp3: takeProfit3,
            trailingSL: trailingStopLoss
        };

        chartFunctions.applyStrategyToChart('Myriad Labs Strategy', params);
    });
});
```

## File: ./static/js/chart.js {#file---static-js-chart-js}

```javascript
import { addIndicator, removeIndicator, getActiveIndicators as getActiveIndicatorsFromModule, clearActiveIndicators } from './modules/activeIndicators.js';
import { myriadLabsStrategy } from './strategies/myriadLabsStrategy.js';

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
            horzLines: { color: 'rgba(197, 203, 206, 5)' },
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

export function applyStrategyToChart(strategy) {
    activeStrategy = strategy;
    clearActiveIndicators();
    const candles = candleSeries.data();
    const params = {
        macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        sl: 10,
        tp1: 20,
        tp2: 30,
        tp3: 40,
        trailingSL: true
    };
    const strategyData = myriadLabsStrategy(candles, params);
    plotStrategyData(strategyData);
}

function plotStrategyData(strategyData) {
    const { macdData, divergences, trades, performanceMetrics } = strategyData;
    plotMACDDivergence(macdData, divergences);
    plotEntryExitPoints(trades);
    plotSLTPLevels(trades);
    plotPerformanceTable(performanceMetrics);
}

function plotPerformanceTable(performanceMetrics) {
    const performanceTable = document.getElementById('performance-table');
    if (performanceTable) {
        performanceTable.innerHTML = `
            <tr><td>Net Profit</td><td>${performanceMetrics.netProfit}</td></tr>
            <tr><td>Total Trades Closed</td><td>${performanceMetrics.totalTradesClosed}</td></tr>
            <tr><td>Percent Profitable</td><td>${performanceMetrics.percentProfitable}%</td></tr>
            <tr><td>Profit Factor</td><td>${performanceMetrics.profitFactor}</td></tr>
            <tr><td>Max Drawdown</td><td>${performanceMetrics.maxDrawdown}</td></tr>
            <tr><td>Average Trade</td><td>${performanceMetrics.averageTrade}</td></tr>
        `;
    }
}

function plotMACDDivergence(macdData, divergences) {
    // Implement MACD divergence plotting logic
}

function plotEntryExitPoints(trades) {
    // Implement entry and exit points plotting logic
}

function plotSLTPLevels(trades) {
    // Implement SL and TP levels plotting logic
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
```

## File: ./static/js/modules/activeIndicators.js {#file---static-js-modules-activeIndicators-js}

```javascript
let activeIndicators = [];

export function addIndicator(indicator) {
    activeIndicators.push(indicator);
}

export function removeIndicator(indicatorId) {
    activeIndicators = activeIndicators.filter(ind => ind.id !== indicatorId);
}

export function getActiveIndicators() {
    return activeIndicators;
}

export function clearActiveIndicators() {
    activeIndicators = [];
}
```

## File: ./static/js/modules/aiAssistant.js {#file---static-js-modules-aiAssistant-js}

```javascript
class AIAssistant {
    constructor() {
        this.chatPanel = document.getElementById('ai-chat-panel');
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-message');
        this.aiChatIcon = document.getElementById('ai-chat-icon');
        this.closeChat = document.getElementById('close-chat');
        this.maximizeChat = document.getElementById('maximize-chat');

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.aiChatIcon) this.aiChatIcon.addEventListener('click', () => this.toggleChatPanel());
        if (this.closeChat) this.closeChat.addEventListener('click', () => this.toggleChatPanel());
        if (this.maximizeChat) this.maximizeChat.addEventListener('click', () => this.maximizeChatPanel());
        if (this.sendButton) this.sendButton.addEventListener('click', () => this.sendChatMessage());
        if (this.userInput) {
            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }

    toggleChatPanel() {
        if (this.chatPanel) {
            this.chatPanel.classList.toggle('open');
        }
    }

    maximizeChatPanel() {
        if (this.chatPanel) {
            this.chatPanel.classList.toggle('maximized');
        }
    }

    sendChatMessage() {
        const message = this.userInput.value.trim();
        if (message) {
            this.appendChatMessage('User', message);
            this.userInput.value = '';
            
            const chartContext = this.getChartContext();
            
            fetch('/api/ai_chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message, chartContext })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.response) {
                    this.appendChatMessage('AI', data.response);
                } else if (data.error) {
                    this.appendChatMessage('AI', 'Error: ' + data.error);
                } else {
                    this.appendChatMessage('AI', 'Error: Unable to get a response.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.appendChatMessage('AI', 'Error: Unable to get a response. Please try again later.');
            });
        }
    }

    appendChatMessage(sender, message) {
        if (this.chatMessages) {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${sender.toLowerCase()}-message`;
            messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
            this.chatMessages.appendChild(messageElement);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    getChartContext() {
        return {
            symbol: window.currentSymbol,
            timeframe: window.currentTimeframe,
            price: window.chartFunctions ? window.chartFunctions.getLastPrice() : null,
            indicators: window.chartFunctions ? window.chartFunctions.getActiveIndicators() : []
        };
    }
}

export function initAIAssistant() {
    const aiAssistant = new AIAssistant();
    window.aiAssistant = aiAssistant;  // Make it globally accessible if needed
}
```

## File: ./static/js/modules/backtesting.js {#file---static-js-modules-backtesting-js}

```javascript
class Backtesting {
    constructor(candles, strategy) {
        this.candles = candles;
        this.strategy = strategy;
        this.trades = [];
        this.performanceMetrics = {};
    }

    run() {
        const strategyData = this.strategy(this.candles);
        this.trades = strategyData.trades;
        this.performanceMetrics = this.calculatePerformanceMetrics();
    }

    calculatePerformanceMetrics() {
        let netProfit = 0;
        let totalTradesClosed = 0;
        let profitableTrades = 0;
        let totalProfit = 0;
        let totalLoss = 0;
        let maxDrawdown = 0;
        let peak = 0;

        this.trades.forEach(trade => {
            if (trade.status === 'closed') {
                totalTradesClosed++;
                const profit = trade.exit - trade.entry;
                netProfit += profit;
                if (profit > 0) {
                    profitableTrades++;
                    totalProfit += profit;
                } else {
                    totalLoss += Math.abs(profit);
                }
                peak = Math.max(peak, netProfit);
                maxDrawdown = Math.max(maxDrawdown, peak - netProfit);
            }
        });

        const percentProfitable = (profitableTrades / totalTradesClosed) * 100;
        const profitFactor = totalProfit / totalLoss;
        const averageTrade = netProfit / totalTradesClosed;

        return {
            netProfit,
            totalTradesClosed,
            percentProfitable,
            profitFactor,
            maxDrawdown,
            averageTrade
        };
    }
}

export default Backtesting;
```

## File: ./static/js/modules/chartControls.js {#file---static-js-modules-chartControls-js}

```javascript
export function initChartControls() {
    initializeTimeframeButtons();
    initializeChartButtons();
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

// You might want to add more functions here to handle other chart controls
```

## File: ./static/js/modules/configurations.js {#file---static-js-modules-configurations-js}

```javascript
class Configurations {
    constructor() {
        this.configurations = this.loadConfigurations();
    }

    saveConfiguration(name, config) {
        this.configurations[name] = config;
        this.saveConfigurations();
    }

    loadConfiguration(name) {
        return this.configurations[name] || null;
    }

    deleteConfiguration(name) {
        delete this.configurations[name];
        this.saveConfigurations();
    }

    saveConfigurations() {
        localStorage.setItem('strategyConfigurations', JSON.stringify(this.configurations));
    }

    loadConfigurations() {
        const savedConfigs = localStorage.getItem('strategyConfigurations');
        return savedConfigs ? JSON.parse(savedConfigs) : {};
    }
}

export default new Configurations();
```

## File: ./static/js/modules/crossBrowser.js {#file---static-js-modules-crossBrowser-js}

```javascript
/**
 * Cross-browser compatibility module
 * Ensures the strategy works consistently across different browsers and devices
 * Implements fallback options for browsers that don't support certain features
 */

/**
 * Check if the browser supports a specific feature
 * @param {string} feature - The feature to check
 * @returns {boolean} - True if the feature is supported, false otherwise
 */
export function isFeatureSupported(feature) {
    switch (feature) {
        case 'WebWorkers':
            return typeof Worker !== 'undefined';
        case 'LocalStorage':
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        case 'ServiceWorkers':
            return 'serviceWorker' in navigator;
        default:
            return false;
    }
}

/**
 * Apply fallback for unsupported features
 * @param {string} feature - The feature to apply fallback for
 */
export function applyFallback(feature) {
    switch (feature) {
        case 'WebWorkers':
            console.warn('Web Workers are not supported in this browser. Performance may be affected.');
            // Implement fallback logic if necessary
            break;
        case 'LocalStorage':
            console.warn('Local Storage is not supported in this browser. Data persistence may be affected.');
            // Implement fallback logic if necessary
            break;
        case 'ServiceWorkers':
            console.warn('Service Workers are not supported in this browser. Offline functionality may be affected.');
            // Implement fallback logic if necessary
            break;
        default:
            console.warn(`No fallback available for unsupported feature: ${feature}`);
            break;
    }
}

/**
 * Initialize cross-browser compatibility checks
 */
export function initCrossBrowserCompatibility() {
    const features = ['WebWorkers', 'LocalStorage', 'ServiceWorkers'];
    features.forEach(feature => {
        if (!isFeatureSupported(feature)) {
            applyFallback(feature);
        }
    });
}
```

## File: ./static/js/modules/customization.js {#file---static-js-modules-customization-js}

```javascript
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
```

## File: ./static/js/modules/dataCache.js {#file---static-js-modules-dataCache-js}

```javascript
class DataCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value) {
        this.cache.set(key, value);
    }

    get(key) {
        return this.cache.get(key);
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

export default new DataCache();
```

## File: ./static/js/modules/dataUpdater.js {#file---static-js-modules-dataUpdater-js}

```javascript
import dataCache from './dataCache.js';

class DataUpdater {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    async fetchData(symbol, timeframe) {
        const cacheKey = `${symbol}_${timeframe}`;
        if (dataCache.has(cacheKey)) {
            return dataCache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.apiEndpoint}?symbol=${symbol}&timeframe=${timeframe}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            dataCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async updateData(symbol, timeframe) {
        const data = await this.fetchData(symbol, timeframe);
        // Implement logic to integrate real-time data with cached historical data
        // This is a placeholder for the actual implementation
        return data;
    }
}

export default DataUpdater;
```

## File: ./static/js/modules/indicatorManager.js {#file---static-js-modules-indicatorManager-js}

```javascript
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

```

## File: ./static/js/modules/indicators.js {#file---static-js-modules-indicators-js}

```javascript
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

    const indicators = [
        { name: 'Simple Moving Average', category: 'trend' },
        { name: 'Exponential Moving Average', category: 'trend' },
        { name: 'Relative Strength Index', category: 'momentum' },
        { name: 'Moving Average Convergence Divergence', category: 'momentum' },
        { name: 'Bollinger Bands', category: 'volatility' },
        { name: 'Average True Range', category: 'volatility' },
        { name: 'On-Balance Volume', category: 'volume' },
    ];

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
                item.querySelector('.add-indicator-btn').addEventListener('click', () => addIndicator(indicator.name));
                item.querySelector('.favorite-btn').addEventListener('click', (e) => toggleFavorite(e.target));
                indicatorsList.appendChild(item);
            });
        }
    }

    renderIndicators(indicators);

    if (indicatorSearch) {
        indicatorSearch.addEventListener('input', () => {
            const searchTerm = indicatorSearch.value.toLowerCase();
            const filteredIndicators = indicators.filter(indicator => 
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
                ? indicators 
                : indicators.filter(indicator => indicator.category === category);
            renderIndicators(filteredIndicators);
        });
    });
}

function addIndicator(indicatorName) {
    console.log(`Adding indicator: ${indicatorName}`);
    // Implement the logic to add the indicator to the chart
    // You might want to call a function from chartFunctions here
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator(indicatorName);
    }
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    // Implement the logic to save favorite indicators
}

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
            horzLines: { color: 'rgba(197, 203, 206, 5)' },
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
       
    });

    chart.timeScale().fitContent();

    chartContainer.addEventListener('mousedown', handleMouseDown);
    chartContainer.addEventListener('mousemove', handleMouseMove);
    chartContainer.addEventListener('mouseup', handleMouseUp);
    chartContainer.addEventListener('contextmenu', handleContextMenu);

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

window.addEventListener('load', () => {
    if (chartFunctions && typeof chartFunctions.createChart === 'function') {
        chartFunctions.createChart();
        chartFunctions.fetchLatestData();
    }
});
```

## File: ./static/js/modules/pineConnector.js {#file---static-js-modules-pineConnector-js}

```javascript
export function sendAlert(type, price) {
    const alertMessage = {
        type: type,
        price: price,
        timestamp: new Date().toISOString()
    };

    fetch('/api/send_alert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertMessage)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Alert sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending alert:', error);
    });
}
```

## File: ./static/js/modules/security.js {#file---static-js-modules-security-js}

```javascript
/**
 * Security module for Myriad Labs strategy.
 * This module implements measures to secure sensitive data, especially for the PineConnector integration.
 * It also includes input validation and sanitization for user-provided strategy parameters.
 */

/**
 * Validate and sanitize user-provided strategy parameters.
 * @param {Object} params - The strategy parameters provided by the user.
 * @returns {Object} - The sanitized strategy parameters.
 */
export function validateAndSanitizeParams(params) {
    const sanitizedParams = {};

    // Validate and sanitize MACD parameters
    sanitizedParams.macdParams = {
        fastPeriod: sanitizeNumber(params.macdParams.fastPeriod, 12),
        slowPeriod: sanitizeNumber(params.macdParams.slowPeriod, 26),
        signalPeriod: sanitizeNumber(params.macdParams.signalPeriod, 9)
    };

    // Validate and sanitize stop-loss and take-profit levels
    sanitizedParams.sl = sanitizeNumber(params.sl, 10);
    sanitizedParams.tp1 = sanitizeNumber(params.tp1, 20);
    sanitizedParams.tp2 = sanitizeNumber(params.tp2, 30);
    sanitizedParams.tp3 = sanitizeNumber(params.tp3, 40);
    sanitizedParams.trailingSL = sanitizeBoolean(params.trailingSL, true);

    return sanitizedParams;
}

/**
 * Sanitize a number input.
 * @param {number} value - The input value to sanitize.
 * @param {number} defaultValue - The default value to use if the input is invalid.
 * @returns {number} - The sanitized number.
 */
function sanitizeNumber(value, defaultValue) {
    const sanitizedValue = parseInt(value, 10);
    return isNaN(sanitizedValue) ? defaultValue : sanitizedValue;
}

/**
 * Sanitize a boolean input.
 * @param {boolean} value - The input value to sanitize.
 * @param {boolean} defaultValue - The default value to use if the input is invalid.
 * @returns {boolean} - The sanitized boolean.
 */
function sanitizeBoolean(value, defaultValue) {
    return typeof value === 'boolean' ? value : defaultValue;
}

/**
 * Secure sensitive data for PineConnector integration.
 * @param {Object} data - The data to secure.
 * @returns {Object} - The secured data.
 */
export function securePineConnectorData(data) {
    // Implement security measures for PineConnector data
    // For example, encrypt the data before sending it to the server
    const securedData = { ...data };
    // Add encryption logic here if needed
    return securedData;
}
```

## File: ./static/js/modules/sidebar.js {#file---static-js-modules-sidebar-js}

```javascript
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
```

## File: ./static/js/modules/strategies.js {#file---static-js-modules-strategies-js}

```javascript
import { myriadLabsStrategy } from '../strategies/myriadLabsStrategy.js';

let strategies = ['Moving Average Crossover', 'RSI Overbought/Oversold', 'MACD Divergence', 'MACD Strategy', 'Myriad Labs Strategy'];
let activeStrategy = null;

export function initStrategies() {
    initializeStrategiesDropdown();
}

function initializeStrategiesDropdown() {
    const dropdown = document.getElementById('strategies-dropdown');
    const dropdownBtn = document.getElementById('strategies-dropdown-btn');

    if (dropdown && dropdownBtn) {
        strategies.forEach(strategy => {
            const button = document.createElement('button');
            button.textContent = strategy;
            button.addEventListener('click', () => selectStrategy(strategy));
            dropdown.appendChild(button);
        });

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        window.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }
}

function selectStrategy(strategy) {
    activeStrategy = strategy;
    console.log(`Selected strategy: ${strategy}`);
    applyStrategyToChart(strategy);
}

function applyStrategyToChart(strategy) {
    removeExistingStrategyIndicators();

    switch(strategy) {
        case 'Moving Average Crossover':
            addMovingAverageCrossover();
            break;
        case 'RSI Overbought/Oversold':
            addRSIStrategy();
            break;
        case 'MACD Divergence':
            addMACDDivergence();
            break;
        case 'MACD Strategy':
            addMACDStrategy();
            break;
        case 'Myriad Labs Strategy':
            addMyriadLabsStrategy();
            break;
    }
}

function removeExistingStrategyIndicators() {
    console.log('Removing existing strategy indicators');
    // Implement the logic to remove existing strategy indicators
}

function addMovingAverageCrossover() {
    console.log('Adding Moving Average Crossover strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('sma', { period: 10, color: 'blue' });
        window.chartFunctions.addChartIndicator('sma', { period: 20, color: 'red' });
    }
}

function addRSIStrategy() {
    console.log('Adding RSI Overbought/Oversold strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('rsi', { period: 14, overbought: 70, oversold: 30 });
    }
}

function addMACDDivergence() {
    console.log('Adding MACD Divergence strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }
}

function addMACDStrategy() {
    console.log('Adding MACD Strategy');
    if (window.chartFunctions && window.chartFunctions.addChartIndicator) {
        window.chartFunctions.addChartIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }
}

function addMyriadLabsStrategy() {
    console.log('Adding Myriad Labs Strategy');
    const candles = window.chartFunctions.getCandles();
    const params = {
        macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        sl: 10,
        tp1: 20,
        tp2: 30,
        tp3: 40,
        trailingSL: true
    };
    const strategyData = myriadLabsStrategy(candles, params);
    plotStrategyData(strategyData);
}

function plotStrategyData(strategyData) {
    const { macdData, divergences, trades, performanceMetrics } = strategyData;
    plotMACDDivergence(macdData, divergences);
    plotEntryExitPoints(trades);
    plotSLTPLevels(trades);
    plotPerformanceTable(performanceMetrics);
}
```

## File: ./static/js/modules/strategyManager.js {#file---static-js-modules-strategyManager-js}

```javascript
class StrategyManager {
    constructor() {
        this.strategies = {};
    }

    addStrategy(name, strategy) {
        this.strategies[name] = strategy;
    }

    removeStrategy(name) {
        delete this.strategies[name];
    }

    enableStrategy(name) {
        if (this.strategies[name]) {
            this.strategies[name].enabled = true;
        }
    }

    disableStrategy(name) {
        if (this.strategies[name]) {
            this.strategies[name].enabled = false;
        }
    }

    getStrategy(name) {
        return this.strategies[name] || null;
    }

    getAllStrategies() {
        return this.strategies;
    }
}

export default new StrategyManager();
```

## File: ./static/js/modules/strategySettingsModal.js {#file---static-js-modules-strategySettingsModal-js}

```javascript
export function showStrategySettingsModal(strategyName, currentParams, onApply) {
    const modal = document.getElementById('myriadlabs-settings-modal');
    const modalTitle = modal.querySelector('h2');
    const form = document.getElementById('myriadlabs-settings-form');
    const applyButton = document.getElementById('apply-myriadlabs-settings');

    modalTitle.textContent = `${strategyName} Settings`;
    form.innerHTML = ''; // Clear existing form fields

    // Create form fields based on currentParams
    for (const [key, value] of Object.entries(currentParams)) {
        const label = document.createElement('label');
        label.textContent = key;
        const input = document.createElement('input');
        input.type = typeof value === 'number' ? 'number' : 'text';
        input.value = value;
        input.name = key;
        form.appendChild(label);
        form.appendChild(input);
    }

    applyButton.onclick = () => {
        const newParams = {};
        new FormData(form).forEach((value, key) => {
            newParams[key] = typeof currentParams[key] === 'number' ? Number(value) : value;
        });
        onApply(newParams);
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

export function hideStrategySettingsModal() {
    // Implementation for hiding the strategy settings modal
    console.log('Hiding strategy settings modal');
    // Add your modal hide logic here
}

export function showStrategySettings(indicatorId) {
    const indicators = getActiveIndicatorsFromModule();
    const indicator = indicators.find(ind => ind.id === indicatorId);
    if (indicator && indicator.type === 'myriadlabs') {
        showStrategySettingsModal('Myriad Labs Strategy', indicator.params, (newParams) => {
            removeChartIndicator(indicatorId);
            addChartIndicator('myriadlabs', newParams);
        });
    }
}

```

## File: ./static/js/modules/theme.js {#file---static-js-modules-theme-js}

```javascript
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
   
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    updateChartTheme();
}

function updateChartTheme() {
    if (typeof chart !== 'undefined' && chart) {
        chart.applyOptions({
            layout: {
                backgroundColor: getComputedStyle(document.body).getPropertyValue('--chart-bg').trim(),
                textColor: getComputedStyle(document.body).getPropertyValue('--text-color').trim(),
            }
        });
    }
}
```

## File: ./static/js/modules/tooltips.js {#file---static-js-modules-tooltips-js}

```javascript
export function addTooltips() {
    const strategyParams = document.querySelectorAll('#myriadlabs-settings-form label');
    strategyParams.forEach(label => {
        const tooltipText = getTooltipText(label.getAttribute('for'));
        if (tooltipText) {
            label.setAttribute('title', tooltipText);
        }
    });
}

function getTooltipText(param) {
    switch (param) {
        case 'macd-fast-period':
            return 'The number of periods for the fast moving average in the MACD calculation.';
        case 'macd-slow-period':
            return 'The number of periods for the slow moving average in the MACD calculation.';
        case 'macd-signal-period':
            return 'The number of periods for the signal line in the MACD calculation.';
        case 'stop-loss':
            return 'The stop loss level for the strategy.';
        case 'take-profit-1':
            return 'The first take profit level for the strategy.';
        case 'take-profit-2':
            return 'The second take profit level for the strategy.';
        case 'take-profit-3':
            return 'The third take profit level for the strategy.';
        case 'trailing-stop-loss':
            return 'Enable or disable trailing stop loss for the strategy.';
        default:
            return '';
    }
}
```

## File: ./static/js/modules/watchlist.js {#file---static-js-modules-watchlist-js}

```javascript
export function initWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || ['EUR_USD', 'GBP_USD'];

    const watchlistSearch = document.getElementById('watchlist-search');
    const categoryButton = document.getElementById('instrument-category-button');
    const categoryContent = document.getElementById('instrument-category-content');
    const watchlistToggle = document.getElementById('watchlist-toggle');

    if (watchlistSearch) {
        watchlistSearch.addEventListener('input', debounce(handleSearch, 300));
    }

    if (categoryButton && categoryContent) {
        categoryButton.addEventListener('click', () => {
            categoryContent.classList.toggle('show');
        });

        document.querySelectorAll('#instrument-category-content a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                categoryButton.textContent = item.textContent;
                categoryContent.classList.remove('show');
                handleSearch();
            });
        });
    }

    if (watchlistToggle) {
        watchlistToggle.addEventListener('click', toggleWatchlist);
    }

    window.addEventListener('click', (e) => {
        if (categoryContent && !e.target.matches('#instrument-category-button')) {
            categoryContent.classList.remove('show');
        }
    });

    updateWatchlistUI();

    function toggleWatchlist() {
        const watchlistPanel = document.getElementById('watchlist-panel');
        if (watchlistPanel) {
            watchlistPanel.classList.toggle('collapsed');
            watchlistToggle.classList.toggle('hidden');
            adjustChartSize();
        }
    }

    function handleSearch() {
        const query = document.getElementById('watchlist-search').value.trim();
        const category = document.getElementById('instrument-category-button').textContent.toLowerCase();
       
        if (query.length > 0 || category !== 'all') {
            searchInstruments(query, category);
        } else {
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.innerHTML = '';
            }
        }
    }

    function searchInstruments(query, category) {
        fetch(`/api/search_instruments?query=${query}&category=${category}`)
            .then(response => response.json())
            .then(data => {
                updateSearchResults(data);
            })
            .catch(error => console.error('Error searching instruments:', error));
    }

    function updateSearchResults(results) {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
            results.forEach(instrument => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <span class="instrument-name">${instrument}</span>
                    <button class="add-btn">${watchlist.includes(instrument) ? '-' : '+'}</button>
                `;
                item.querySelector('.instrument-name').addEventListener('click', () => {
                    if (window.chartFunctions && window.chartFunctions.switchSymbol) {
                        window.chartFunctions.switchSymbol(instrument);
                    }
                });
                item.querySelector('.add-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (watchlist.includes(instrument)) {
                        removeFromWatchlist(instrument);
                    } else {
                        addToWatchlist(instrument);
                    }
                    e.target.textContent = watchlist.includes(instrument) ? '-' : '+';
                });
                searchResults.appendChild(item);
            });
        }
    }

    function addToWatchlist(symbol) {
        if (!watchlist.includes(symbol)) {
            watchlist.push(symbol);
            saveWatchlist();
            updateWatchlistUI();
        }
    }

    function removeFromWatchlist(symbol) {
        watchlist = watchlist.filter(s => s !== symbol);
        saveWatchlist();
        updateWatchlistUI();
    }

    function saveWatchlist() {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }

    function updateWatchlistUI() {
        const container = document.getElementById('watchlist-container');
        if (container) {
            container.innerHTML = '';
            watchlist.forEach(symbol => {
                const item = document.createElement('div');
                item.className = 'watchlist-item';
                item.setAttribute('draggable', true);
                item.dataset.symbol = symbol;
                item.innerHTML = `
                    <span class="symbol">${symbol}</span>
                    <span class="price">--</span>
                    <span class="change">--</span>
                    <button class="remove-btn">-</button>
                `;
                item.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromWatchlist(symbol);
                });
                item.addEventListener('click', () => {
                    if (window.chartFunctions && window.chartFunctions.switchSymbol) {
                        window.chartFunctions.switchSymbol(symbol);
                    }
                });
                container.appendChild(item);
            });
            updateWatchlistData();
        }
    }

    function updateWatchlistData() {
        watchlist.forEach(symbol => {
            fetch(`/api/price_data?symbol=${symbol}`)
                .then(response => response.json())
                .then(data => {
                    const item = document.querySelector(`.watchlist-item[data-symbol="${symbol}"]`);
                    if (item && data.price) {
                        item.querySelector('.price').textContent = data.price.toFixed(5);
                        item.querySelector('.change').textContent = data.change.toFixed(2) + '%';
                    }
                })
                .catch(error => console.error('Error fetching price data:', error));
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function adjustChartSize() {
        if (window.chartFunctions && window.chartFunctions.adjustChartSize) {
            window.chartFunctions.adjustChartSize();
        }
    }

    setInterval(updateWatchlistData, 60000);
}
```

## File: ./static/js/modules/zoomPan.js {#file---static-js-modules-zoomPan-js}

```javascript
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
```

## File: ./static/js/strategies/macd_divergence.py {#file---static-js-strategies-macd-divergence-py}

```python
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
```

## File: ./static/js/strategies/myriadLabsStrategy.js {#file---static-js-strategies-myriadLabsStrategy-js}

```javascript
import { calculateMACD, detectDivergences, calculatePerformanceMetrics } from '../modules/indicators.js';
import { sendAlert } from '../modules/pineConnector.js';

export function myriadLabsStrategy(candles, params) {
    const { macdParams, sl, tp1, tp2, tp3, trailingSL } = params;

    // Calculate MACD
    const macdData = calculateMACD(candles, macdParams);

    // Detect divergences
    const divergences = detectDivergences(macdData);

    // Initialize trades and performance metrics
    let trades = [];
    let performanceMetrics = {
        netProfit: 0,
        totalTradesClosed: 0,
        percentProfitable: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        averageTrade: 0
    };

    // Implement trading logic based on divergences
    divergences.forEach(divergence => {
        const { type, start, end } = divergence;
        const price = candles[end].close;

        if (type === 'positive' && price > candles[start].high) {
            // Enter long position
            const trade = {
                entry: price,
                sl: price - sl,
                tp1: price + tp1,
                tp2: price + tp2,
                tp3: price + tp3,
                trailingSL: trailingSL ? price - sl : null,
                status: 'open'
            };
            trades.push(trade);
            sendAlert('long', price);
        } else if (type === 'negative' && price < candles[start].low) {
            // Enter short position
            const trade = {
                entry: price,
                sl: price + sl,
                tp1: price - tp1,
                tp2: price - tp2,
                tp3: price - tp3,
                trailingSL: trailingSL ? price + sl : null,
                status: 'open'
            };
            trades.push(trade);
            sendAlert('short', price);
        }
    });

    // Update performance metrics after each trade
    trades.forEach(trade => {
        if (trade.status === 'closed') {
            performanceMetrics = calculatePerformanceMetrics(trades);
        }
    });

    return {
        macdData,
        divergences,
        trades,
        performanceMetrics
    };
}
```

## File: ./static/js/strategies/strategy_manager.py {#file---static-js-strategies-strategy-manager-py}

```python
class StrategyManager:
    def __init__(self):
        self.strategies = {}

    def add_strategy(self, name, strategy_function):
        if name not in self.strategies:
            self.strategies[name] = strategy_function
            print(f"Strategy {name} added.")
        else:
            print(f"Strategy {name} already exists.")

    def remove_strategy(self, name):
        if name in self.strategies:
            del self.strategies[name]
            print(f"Strategy {name} removed.")
        else:
            print(f"Strategy {name} does not exist.")

    def execute_strategy(self, name, data):
        if name in self.strategies:
            return self.strategies[name](data)
        else:
            print(f"Strategy {name} does not exist.")
            return None

# Example usage
if __name__ == "__main__":
    from macd_divergence import macd_divergence_strategy

    manager = StrategyManager()
    manager.add_strategy("MACD Divergence", macd_divergence_strategy)

    # Assuming 'data' is a DataFrame with the necessary structure
    data = None  # Replace with actual data
    trades = manager.execute_strategy("MACD Divergence", data)
    print(trades)
```

## File: ./templates/index.html {#file---templates-index-html}

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Myriad Labs</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}">
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="dark-theme">
    <div id="app">
        <header>
            <button id="sidebar-toggle" class="icon-button"><i class="fas fa-bars"></i></button>
            <h1>Myriad Labs</h1>
            <div id="theme-toggle">
                <input type="checkbox" id="theme-switch">
                <label for="theme-switch" class="switch">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon"></i>
                </label>
            </div>
        </header>
        <main>
            <aside id="sidebar">
                <div class="tool-category">
                    <h3>Drawing Tools</h3>
                    <div class="tool-grid">
                        <button class="tool-button" data-tool="trendline"><i class="fas fa-chart-line"></i></button>
                        <button class="tool-button" data-tool="horizontalLine"><i class="fas fa-minus"></i></button>
                        <button class="tool-button" data-tool="verticalLine"><i class="fas fa-grip-lines-vertical"></i></button>
                        <button class="tool-button" data-tool="rectangle"><i class="far fa-square"></i></button>
                        <button class="tool-button" data-tool="ellipse"><i class="far fa-circle"></i></button>
                        <button class="tool-button" data-tool="fibonacciRetracement"><i class="fas fa-project-diagram"></i></button>
                        <button class="tool-button" data-tool="text"><i class="fas fa-font"></i></button>
                        <button class="tool-button" data-tool="arrow"><i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                <div class="tool-category">
                    <h3>Zoom Tools</h3>
                    <div class="tool-grid">
                        <button class="tool-button" data-zoom="in"><i class="fas fa-search-plus"></i></button>
                        <button class="tool-button" data-zoom="out"><i class="fas fa-search-minus"></i></button>
                        <button class="tool-button" data-zoom="fit"><i class="fas fa-compress-arrows-alt"></i></button>
                    </div>
                </div>
                <div class="tool-category">
                    <h3>Actions</h3>
                    <div class="tool-grid">
                        <button class="tool-button" id="undo-button"><i class="fas fa-undo"></i></button>
                        <button class="tool-button" id="redo-button"><i class="fas fa-redo"></i></button>
                    </div>
                </div>
            </aside>
            <div id="chart-container">
                <div id="chart-controls">
                    <div id="timeframe-selector">
                        <button class="timeframe-btn" data-timeframe="M1">1m</button>
                        <button class="timeframe-btn" data-timeframe="M5">5m</button>
                        <button class="timeframe-btn" data-timeframe="M15">15m</button>
                        <button class="timeframe-btn" data-timeframe="M30">30m</button>
                        <button class="timeframe-btn" data-timeframe="H1" selected>1h</button>
                        <button class="timeframe-btn" data-timeframe="H4">4h</button>
                        <button class="timeframe-btn" data-timeframe="D">1D</button>
                        <button class="timeframe-btn" data-timeframe="W">1W</button>
                        <button class="timeframe-btn" data-timeframe="M">1M</button>
                    </div>
                    <div id="chart-buttons">
                        <button id="indicators-button" class="chart-btn"><i class="fas fa-chart-line"></i> Indicators</button>
                        <button id="strategies-dropdown-btn" class="chart-btn"><i class="fas fa-brain"></i> Strategies</button>
                    </div>
                </div>
                <div id="strategies-dropdown" class="dropdown-content">
                    <!-- Strategy options will be dynamically added here -->
                </div>
                <div id="symbol-info"></div>
                <div id="candlestick-chart"></div>
                <div id="performance-table-container">
                    <table id="performance-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Performance metrics will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>
            <aside id="watchlist-panel" class="panel">
                <h3>Watchlist <button id="watchlist-toggle" class="icon-button"><i class="fas fa-chevron-right"></i></button></h3>
                <div id="watchlist-search-container">
                    <input type="text" id="watchlist-search" placeholder="Search instruments...">
                    <div id="instrument-category-dropdown">
                        <button id="instrument-category-button">All</button>
                        <div id="instrument-category-content">
                            <a href="#" data-category="all">All</a>
                            <a href="#" data-category="forex">Forex</a>
                            <a href="#" data-category="commodities">Commodities</a>
                            <a href="#" data-category="indices">Indices</a>
                        </div>
                    </div>
                    <div id="search-results"></div>
                </div>
                <div id="watchlist-container"></div>
            </aside>
        </main>
        <div id="ai-chat-icon"><i class="fas fa-robot"></i></div>
        <div id="ai-chat-panel" class="panel">
            <div id="ai-chat-header">
                <h3>AI Trading Assistant</h3>
                <button id="maximize-chat" class="icon-button"><i class="fas fa-expand"></i></button>
                <button id="close-chat" class="icon-button"><i class="fas fa-times"></i></button>
            </div>
            <div id="chat-messages"></div>
            <div id="chat-input-container">
                <input type="text" id="user-input" placeholder="Ask about trading or chart analysis...">
                <button id="send-message" class="icon-button"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    <div id="chart-context-menu"></div>
    <div id="watchlist-context-menu"></div>
    
    <!-- Indicators Modal -->
    <div id="indicators-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Indicator</h2>
                <span class="close">&times;</span>
            </div>
            <input type="text" id="indicator-search" placeholder="Search indicators...">
            <div id="indicator-categories">
                <button class="category-btn active" data-category="all">All</button>
                <button class="category-btn" data-category="trend">Trend</button>
                <button class="category-btn" data-category="momentum">Momentum</button>
                <button class="category-btn" data-category="volatility">Volatility</button>
                <button class="category-btn" data-category="volume">Volume</button>
            </div>
            <div id="indicators-list">
                <!-- Indicator items will be dynamically added here -->
            </div>
        </div>
    </div>

    <!-- MyriadLabs Strategy Settings Modal -->
    <div id="myriadlabs-settings-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>MyriadLabs Strategy Settings</h2>
                <span class="close">&times;</span>
            </div>
            <div id="myriadlabs-settings-form">
                <label for="macd-fast-period">MACD Fast Period:</label>
                <input type="number" id="macd-fast-period" name="macd-fast-period" value="12">
                <label for="macd-slow-period">MACD Slow Period:</label>
                <input type="number" id="macd-slow-period" name="macd-slow-period" value="26">
                <label for="macd-signal-period">MACD Signal Period:</label>
                <input type="number" id="macd-signal-period" name="macd-signal-period" value="9">
                <label for="stop-loss">Stop Loss:</label>
                <input type="number" id="stop-loss" name="stop-loss" value="10">
                <label for="take-profit-1">Take Profit 1:</label>
                <input type="number" id="take-profit-1" name="take-profit-1" value="20">
                <label for="take-profit-2">Take Profit 2:</label>
                <input type="number" id="take-profit-2" name="take-profit-2" value="30">
                <label for="take-profit-3">Take Profit 3:</label>
                <input type="number" id="take-profit-3" name="take-profit-3" value="40">
                <label for="trailing-stop-loss">Trailing Stop Loss:</label>
                <input type="checkbox" id="trailing-stop-loss" name="trailing-stop-loss">
            </div>
            <button id="apply-myriadlabs-settings">Apply Settings</button>
        </div>
    </div>

    <script src="{{ url_for('static', filename='js/chart.js') }}" type="module"></script>
    <script src="{{ url_for('static', filename='js/app.js') }}" type="module"></script>
</body>
</html>
```

## File: ./tests/myriadLabsStrategy.test.js {#file---tests-myriadLabsStrategy-test-js}

```javascript
import { myriadLabsStrategy } from '../static/js/strategies/myriadLabsStrategy';

describe('Myriad Labs Strategy', () => {
    const sampleCandles = [
        { time: 1, open: 1.1, high: 1.2, low: 1.0, close: 1.15 },
        { time: 2, open: 1.15, high: 1.25, low: 1.1, close: 1.2 },
        { time: 3, open: 1.2, high: 1.3, low: 1.15, close: 1.25 },
        { time: 4, open: 1.25, high: 1.35, low: 1.2, close: 1.3 },
        { time: 5, open: 1.3, high: 1.4, low: 1.25, close: 1.35 },
        { time: 6, open: 1.35, high: 1.45, low: 1.3, close: 1.4 },
        { time: 7, open: 1.4, high: 1.5, low: 1.35, close: 1.45 },
        { time: 8, open: 1.45, high: 1.55, low: 1.4, close: 1.5 },
        { time: 9, open: 1.5, high: 1.6, low: 1.45, close: 1.55 },
        { time: 10, open: 1.55, high: 1.65, low: 1.5, close: 1.6 }
    ];

    const params = {
        macdParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        sl: 10,
        tp1: 20,
        tp2: 30,
        tp3: 40,
        trailingSL: true
    };

    it('should return strategy data with correct structure', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData).toHaveProperty('macdData');
        expect(strategyData).toHaveProperty('divergences');
        expect(strategyData).toHaveProperty('trades');
        expect(strategyData).toHaveProperty('performanceMetrics');
    });

    it('should detect divergences correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData.divergences.length).toBeGreaterThan(0);
    });

    it('should calculate performance metrics correctly', () => {
        const strategyData = myriadLabsStrategy(sampleCandles, params);
        expect(strategyData.performanceMetrics).toHaveProperty('netProfit');
        expect(strategyData.performanceMetrics).toHaveProperty('totalTradesClosed');
        expect(strategyData.performanceMetrics).toHaveProperty('percentProfitable');
        expect(strategyData.performanceMetrics).toHaveProperty('profitFactor');
        expect(strategyData.performanceMetrics).toHaveProperty('maxDrawdown');
        expect(strategyData.performanceMetrics).toHaveProperty('averageTrade');
    });
});
```

