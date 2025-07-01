from website import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Get port from environment variable (for deployment platforms)
    port = int(os.environ.get('PORT', 5000))
    
    # Run the app
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=port,
        debug=os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    )