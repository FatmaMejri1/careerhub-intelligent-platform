from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config.from_object(Config)

    # Import des routes
    from routes.ai_routes import ai_bp
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)