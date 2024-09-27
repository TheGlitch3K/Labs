I am not seing the candle sticks on my chart. I need you to focus on strictly fixing this issue:

Here is my code base:

# Project Code Overview

Generated on: Thu Sep 26 20:16:46 CDT 2024

## Table of Contents

- [./Stories/add_indicators_button_feature.md](#file---Stories-add-indicators-button-feature-md)
- [./config/settings.py](#file---config-settings-py)
- [./main.py](#file---main-py)
- [./requirements.txt](#file---requirements-txt)
- [./src/ai/ai_client.py](#file---src-ai-ai-client-py)
- [./src/data/data_fetcher.py](#file---src-data-data-fetcher-py)
- [./src/routes/api_routes.py](#file---src-routes-api-routes-py)
- [./src/routes/main_routes.py](#file---src-routes-main-routes-py)
- [./static/css/ai-chat.css](#file---static-css-ai-chat-css)
- [./static/css/chart.css](#file---static-css-chart-css)
- [./static/css/components.css](#file---static-css-components-css)
- [./static/css/layout.css](#file---static-css-layout-css)
- [./static/css/main.css](#file---static-css-main-css)
- [./static/css/modal.css](#file---static-css-modal-css)
- [./static/css/responsive.css](#file---static-css-responsive-css)
- [./static/css/sidebar.css](#file---static-css-sidebar-css)
- [./static/css/variables.css](#file---static-css-variables-css)
- [./static/css/watchlist.css](#file---static-css-watchlist-css)
- [./static/js/app.js](#file---static-js-app-js)
- [./static/js/modules/chartControls.js](#file---static-js-modules-chartControls-js)
- [./static/js/modules/chat.js](#file---static-js-modules-chat-js)
- [./static/js/modules/indicators.js](#file---static-js-modules-indicators-js)
- [./static/js/modules/sidebar.js](#file---static-js-modules-sidebar-js)
- [./static/js/modules/strategies.js](#file---static-js-modules-strategies-js)
- [./static/js/modules/theme.js](#file---static-js-modules-theme-js)
- [./static/js/modules/watchlist.js](#file---static-js-modules-watchlist-js)
- [./templates/index.html](#file---templates-index-html)

## File: ./Stories/add_indicators_button_feature.md {#file---Stories-add-indicators-button-feature-md}

```markdown
# Feature: Add Indicators Button to Chart Interface

## Branch: add-indicators-button

## Overview
This feature adds an "Indicators" button to the chart interface, allowing users to access and manage technical indicators for their trading analysis. The button is positioned alongside the timeframe selector buttons, providing easy access to a modal window for indicator selection and configuration.

## Purpose
The purpose of this feature is to enhance the trading platform's analytical capabilities by giving users quick access to various technical indicators. This addition aims to improve user experience and provide more comprehensive tools for market analysis directly within the chart interface.

## Implementation Details

### HTML Changes (index.html)
- Added a new button with id "indicators-button" to the timeframe selector div.
- Implemented a modal structure for the indicators selection interface.

### CSS Changes (styles.css)
- Styled the new Indicators button to match existing timeframe buttons.
- Added styles for the modal, including layout, positioning, and theme-consistent colors.
- Ensured responsive design for various screen sizes.

### JavaScript Changes (app.js)
- Implemented openIndicatorsModal() and closeIndicatorsModal() functions to handle the modal's display.
- Added fetchIndicators() function to retrieve indicator data from the server.
- Created updateIndicatorsList() to populate the modal with available indicators.
- Implemented filterIndicators() for search functionality within the indicators list.
- Added event listeners for the new Indicators button and modal interactions.

## Key Features
1. Indicators button integrated seamlessly with existing timeframe selectors.
2. Modal window for indicator selection and management.
3. Search functionality to easily find specific indicators.
4. Categorized view of indicators (Favorites, Personal, Technicals, Financials, Community).
5. Responsive design ensuring functionality across different devices and screen sizes.

## Technical Considerations
- The feature uses vanilla JavaScript for DOM manipulation and event handling.
- CSS variables are utilized for consistent theming and easy customization.
- The modal is designed to be non-blocking, allowing users to interact with the chart while it's open.
- Placeholder data is used for indicators, to be replaced with actual backend integration in future iterations.

## Future Enhancements
1. Implement backend API for fetching real indicator data.
2. Add functionality to apply selected indicators to the chart.
3. Develop a system for users to save and manage favorite indicators.
4. Introduce more advanced filtering and sorting options for indicators.
5. Implement indicator customization options (e.g., period, color).

## Testing Considerations
- Verify that the Indicators button appears correctly in various browser environments.
- Ensure the modal opens and closes as expected.
- Test the search functionality with various input scenarios.
- Confirm that the UI is responsive and functions correctly on mobile devices.
- Check for any potential conflicts with existing chart functionalities.

## Deployment Notes
- This feature is primarily front-end focused and doesn't require database migrations.
- Ensure that the new static files (updated CSS and JS) are properly cached and served.
- Monitor for any performance impacts, especially on mobile devices.

## Conclusion
The addition of the Indicators button and associated modal interface represents a significant enhancement to the trading platform's functionality. It provides users with easier access to technical analysis tools, potentially improving their trading decisions and overall satisfaction with the platform.

## Short-term Improvement Plan

To make this feature better and complete, we need to focus on the following steps:

1. Backend Integration:
   - Develop an API endpoint for fetching indicator data.
   - Implement server-side logic to manage and store indicator configurations.

2. Chart Integration:
   - Modify the chart.js file to support adding and removing indicators.
   - Implement rendering logic for different types of indicators (e.g., overlays, separate panels).

3. Indicator Customization:
   - Add UI elements in the modal for customizing indicator parameters.
   - Implement real-time preview of indicator changes on the chart.

4. Favorites System:
   - Add functionality to mark indicators as favorites.
   - Implement persistent storage of user preferences.

5. Performance Optimization:
   - Optimize indicator calculations for real-time updates.
   - Implement efficient data caching mechanisms.

6. Advanced Filtering:
   - Add sorting options for the indicator list.
   - Implement more advanced search and filter capabilities.

7. Testing and Bug Fixes:
   - Conduct thorough testing of all new functionalities.
   - Address any bugs or issues discovered during testing.

8. Documentation and Code Cleanup:
   - Update documentation to reflect new features and usage instructions.
   - Refactor and clean up code as necessary.

By completing these steps, we will transform the current UI-focused feature into a fully functional and integrated part of the trading platform, significantly enhancing its analytical capabilities.
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

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')

    # Initialize logging
    logging.basicConfig(level=logging.INFO)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)```

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
            raise Exception(f"Error generating AI response: {str(e)}")```

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
from flask import Blueprint, request, jsonify
import os
import json
from src.data.data_fetcher import OandaDataFetcher
from src.ai.ai_client import AIClient

api_bp = Blueprint('api', __name__)

# Initialize OandaDataFetcher with API key
OANDA_API_KEY = os.getenv('OANDA_API_KEY')
if not OANDA_API_KEY:
    raise ValueError("OANDA_API_KEY is not set in environment variables.")
data_fetcher = OandaDataFetcher(api_key=OANDA_API_KEY)

# Initialize AI client with API key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in environment variables.")
ai_client = AIClient(api_key=OPENAI_API_KEY)

@api_bp.route('/candlestick_data')
def candlestick_data():
    symbol = request.args.get('symbol', 'EUR_USD')
    timeframe = request.args.get('timeframe', 'H1')
    count = int(request.args.get('count', 1000))
    try:
        data = data_fetcher.fetch_candlestick_data(instrument=symbol, granularity=timeframe, count=count)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/price_data')
def price_data():
    symbol = request.args.get('symbol', 'EUR_USD')
    try:
        data = data_fetcher.fetch_price_data(symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/search_instruments')
def search_instruments():
    query = request.args.get('query', '').upper()
    category = request.args.get('category', 'all')
    try:
        instruments = data_fetcher.search_instruments(query, category)
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
        ai_response = ai_client.generate_response(prompt=user_input, chart_context=chart_context)
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
}

#ai-chat-panel.open {
    right: 20px;
}

#ai-chat-panel.maximized {
    height: calc(100% - 100px);
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
import { initChat } from './modules/chat.js';
import { initStrategies } from './modules/strategies.js';
import { initIndicators } from './modules/indicators.js';
import { initChartControls } from './modules/chartControls.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initWatchlist();
    initChat();
    initStrategies();
    initIndicators();
    initChartControls();
});
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
            document.querySelector('.timeframe-btn[selected]').removeAttribute('selected');
            e.target.setAttribute('selected', '');
            window.currentTimeframe = e.target.dataset.timeframe;
            window.chartFunctions.switchTimeframe(e.target.dataset.timeframe);
        });
    });
}

function initializeChartButtons() {
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.target.closest('.tool-button').dataset.tool;
            window.chartFunctions.setActiveDrawingTool(tool);
        });
    });
}

// You might want to add more functions here to handle other chart controls
```

## File: ./static/js/modules/chat.js {#file---static-js-modules-chat-js}

```javascript
export function initChat() {
    document.getElementById('ai-chat-icon').addEventListener('click', toggleChatPanel);
    document.getElementById('close-chat').addEventListener('click', toggleChatPanel);
    document.getElementById('maximize-chat').addEventListener('click', maximizeChatPanel);
    document.getElementById('send-message').addEventListener('click', sendChatMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function toggleChatPanel() {
    const chatPanel = document.getElementById('ai-chat-panel');
    chatPanel.classList.toggle('open');
}

function maximizeChatPanel() {
    const chatPanel = document.getElementById('ai-chat-panel');
    chatPanel.classList.toggle('maximized');
}

function sendChatMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (message) {
        appendChatMessage('User', message);
        input.value = '';
        fetch('/api/ai_chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: message,
                chartContext: {
                    symbol: window.currentSymbol,
                    timeframe: window.currentTimeframe,
                    price: window.chartFunctions.getLastPrice(),
                    indicators: getActiveIndicators()
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                appendChatMessage('AI', data.response);
            } else {
                appendChatMessage('AI', 'Error: Unable to get a response.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            appendChatMessage('AI', 'Error: Unable to get a response.');
        });
    }
}

function appendChatMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender.toLowerCase()}-message`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getActiveIndicators() {
    // Implement this function to return active indicators
    return [];
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
    const span = document.getElementsByClassName('close')[0];
    const indicatorsList = document.getElementById('indicators-list');
    const indicatorSearch = document.getElementById('indicator-search');
    const categoryButtons = document.querySelectorAll('.category-btn');

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
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

    renderIndicators(indicators);

    indicatorSearch.addEventListener('input', () => {
        const searchTerm = indicatorSearch.value.toLowerCase();
        const filteredIndicators = indicators.filter(indicator => 
            indicator.name.toLowerCase().includes(searchTerm)
        );
        renderIndicators(filteredIndicators);
    });

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
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    // Implement the logic to save favorite indicators
}
```

## File: ./static/js/modules/sidebar.js {#file---static-js-modules-sidebar-js}

```javascript
export function initSidebar() {
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    adjustChartSize();
}

function adjustChartSize() {
    var chartContainer = document.getElementById('chart-container');
    var sidebar = document.getElementById('sidebar');
    var watchlistPanel = document.getElementById('watchlist-panel');
   
    var sidebarWidth = sidebar.classList.contains('collapsed') ? 50 : 250;
    var watchlistWidth = watchlistPanel.classList.contains('collapsed') ? 0 : 300;
   
    var newWidth = window.innerWidth - sidebarWidth - watchlistWidth;
    chartContainer.style.width = newWidth + 'px';
   
    if (typeof chart !== 'undefined' && chart) {
        chart.applyOptions({ width: newWidth });
    }
}
```

## File: ./static/js/modules/strategies.js {#file---static-js-modules-strategies-js}

```javascript
let strategies = ['Moving Average Crossover', 'RSI Overbought/Oversold', 'MACD Divergence'];
let activeStrategy = null;

export function initStrategies() {
    initializeStrategiesDropdown();
}

function initializeStrategiesDropdown() {
    const dropdown = document.getElementById('strategies-dropdown');
    const dropdownBtn = document.getElementById('strategies-dropdown-btn');

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
    }
}

function removeExistingStrategyIndicators() {
    console.log('Removing existing strategy indicators');
}

function addMovingAverageCrossover() {
    console.log('Adding Moving Average Crossover strategy');
    window.chartFunctions.addIndicator('sma', { period: 10, color: 'blue' });
    window.chartFunctions.addIndicator('sma', { period: 20, color: 'red' });
}

function addRSIStrategy() {
    console.log('Adding RSI Overbought/Oversold strategy');
    window.chartFunctions.addIndicator('rsi', { period: 14, overbought: 70, oversold: 30 });
}

function addMACDDivergence() {
    console.log('Adding MACD Divergence strategy');
    window.chartFunctions.addIndicator('macd', { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
}
```

## File: ./static/js/modules/theme.js {#file---static-js-modules-theme-js}

```javascript
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
   
    document.getElementById('theme-switch').addEventListener('change', toggleTheme);
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

## File: ./static/js/modules/watchlist.js {#file---static-js-modules-watchlist-js}

```javascript
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || ['EUR_USD', 'GBP_USD'];

export function initWatchlist() {
    const watchlistSearch = document.getElementById('watchlist-search');
    const categoryButton = document.getElementById('instrument-category-button');
    const categoryContent = document.getElementById('instrument-category-content');

    watchlistSearch.addEventListener('input', debounce(handleSearch, 300));

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

    window.addEventListener('click', (e) => {
        if (!e.target.matches('#instrument-category-button')) {
            categoryContent.classList.remove('show');
        }
    });

    document.getElementById('watchlist-toggle').addEventListener('click', toggleWatchlist);

    updateWatchlistUI();
}

function toggleWatchlist() {
    const watchlistPanel = document.getElementById('watchlist-panel');
    watchlistPanel.classList.toggle('collapsed');
    const toggleButton = document.getElementById('watchlist-toggle');
    toggleButton.classList.toggle('hidden');
    adjustChartSize();
}

function handleSearch() {
    const query = document.getElementById('watchlist-search').value.trim();
    const category = document.getElementById('instrument-category-button').textContent.toLowerCase();
   
    if (query.length > 0 || category !== 'all') {
        searchInstruments(query, category);
    } else {
        document.getElementById('search-results').innerHTML = '';
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
    searchResults.innerHTML = '';
    results.forEach(instrument => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <span class="instrument-name">${instrument}</span>
            <button class="add-btn">${watchlist.includes(instrument) ? '-' : '+'}</button>
        `;
        item.querySelector('.instrument-name').addEventListener('click', () => {
            window.chartFunctions.switchSymbol(instrument);
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
            window.chartFunctions.switchSymbol(symbol);
        });
        container.appendChild(item);
    });
    updateWatchlistData();
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

setInterval(updateWatchlistData, 60000);
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
                <!-- Strategy settings form will be dynamically added here -->
            </div>
            <button id="apply-myriadlabs-settings">Apply Settings</button>
        </div>
    </div>

    <script src="{{ url_for('static', filename='js/app.js') }}" type="module"></script>
</body>
</html>
```
I need you to provide code for several files that need to be created or updated. Please follow these guidelines. It should not be in one text so I can easy click copy and paste:

1. Provide the complete code for each file, not just snippets or partial updates.
2. Present the code in a format that I can easily copy and paste into my command line.
3. Use the following format for each file:
```bash
cat << EOF > [file_path_and_name]
[complete file content here]
EOF
If a file requires a new directory to be created, include the necessary mkdir command before the cat command, like this:
bashCopymkdir -p [directory_path] && cat << EOF > [file_path_and_name]
[complete file content here]
EOF
Ensure that each command is on a new line and properly formatted for easy copying and pasting.
If there are any special characters or formatting in the code that might interfere with the bash heredoc syntax (<<EOF), please adjust the code or use a different approach to ensure it works correctly in the command line.
After providing all the file contents, give a brief explanation of what each file does and any additional steps I need to take (e.g., installing dependencies, running specific commands).
The files I need code for are:
[List the files you need, e.g.:
src/components/MyComponent.js
src/utils/helpers.js
config/settings.json
...]  Please follow my instructions and always include the entire code when you provide me code. I want complete code for each file that needs to be addressed with no placeholders