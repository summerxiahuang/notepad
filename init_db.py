from website import create_app, db
import os

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
    
    # Print some useful information for debugging
    print(f"Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
    print(f"Environment: {os.environ.get('FLASK_ENV', 'development')}") 