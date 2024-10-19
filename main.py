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
    app.ai_client = AIClient(api_key=app.config['OPENAI_API_KEY'])

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
