# 🚀 Deployment Guide for Smart Notes

This guide covers multiple deployment options for your Smart Notes Flask application.

## 📋 Prerequisites

Before deploying, ensure your application is ready:

1. **Test locally** - Make sure everything works on your machine
2. **Environment variables** - Set up any sensitive configuration
3. **Database** - Ensure your database is properly configured
4. **Dependencies** - All requirements are in `requirements.txt`

## 🌐 Deployment Options

### 1. **Heroku (Recommended for Beginners)**

#### **Setup Heroku**
```bash
# Install Heroku CLI
# macOS: brew install heroku/brew/heroku
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-smart-notes-app

# Add PostgreSQL addon (free tier available)
heroku addons:create heroku-postgresql:mini
```

#### **Configure Environment Variables**
```bash
# Set environment variables
heroku config:set SECRET_KEY="your-secret-key-here"
heroku config:set FLASK_ENV="production"
```

#### **Deploy to Heroku**
```bash
# Add all files to git
git add .
git commit -m "Ready for deployment"

# Deploy to Heroku
git push heroku main

# Run database migrations
heroku run python init_db.py

# Open your app
heroku open
```

#### **Heroku Configuration Files**

**`Procfile`** (already exists):
```
web: gunicorn main:app
```

**`runtime.txt`** (create this file):
```
python-3.11.7
```

### 2. **Railway (Modern Alternative)**

#### **Setup Railway**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project
4. Select "Deploy from GitHub repo"

#### **Configure Environment Variables**
In Railway dashboard:
- `SECRET_KEY`: Your secret key
- `FLASK_ENV`: production
- `DATABASE_URL`: Auto-configured by Railway

#### **Deploy**
Railway will automatically deploy when you push to your main branch.

### 3. **Render (Free Tier Available)**

#### **Setup Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create a new Web Service
4. Select your repository

#### **Configuration**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn main:app`
- **Environment**: Python 3

#### **Environment Variables**
- `SECRET_KEY`: Your secret key
- `FLASK_ENV`: production

### 4. **DigitalOcean App Platform**

#### **Setup**
1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect your GitHub account
3. Create a new app
4. Select your repository

#### **Configuration**
- **Build Command**: `pip install -r requirements.txt`
- **Run Command**: `gunicorn main:app`
- **Environment**: Python

### 5. **VPS Deployment (Advanced)**

#### **Server Setup (Ubuntu/Debian)**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx -y

# Install PostgreSQL (optional, for production database)
sudo apt install postgresql postgresql-contrib -y
```

#### **Application Setup**
```bash
# Clone your repository
git clone https://github.com/yourusername/notepad.git
cd notepad

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export SECRET_KEY="your-secret-key"
export FLASK_ENV="production"
```

#### **Gunicorn Configuration**
Create `gunicorn.conf.py`:
```python
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

#### **Systemd Service**
Create `/etc/systemd/system/smart-notes.service`:
```ini
[Unit]
Description=Smart Notes Flask Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/notepad
Environment="PATH=/path/to/your/notepad/venv/bin"
Environment="SECRET_KEY=your-secret-key"
Environment="FLASK_ENV=production"
ExecStart=/path/to/your/notepad/venv/bin/gunicorn -c gunicorn.conf.py main:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

#### **Nginx Configuration**
Create `/etc/nginx/sites-available/smart-notes`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /path/to/your/notepad/website/static;
        expires 30d;
    }
}
```

#### **Start Services**
```bash
# Enable and start the service
sudo systemctl enable smart-notes
sudo systemctl start smart-notes

# Enable nginx site
sudo ln -s /etc/nginx/sites-available/smart-notes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Production Configuration

### **Environment Variables**
Create a `.env` file for local development:
```env
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
DATABASE_URL=sqlite:///website/database.db
```

### **Database Configuration**
For production, consider using PostgreSQL:

```python
# In website/__init__.py
import os

def create_app():
    app = Flask(__name__)
    
    # Use PostgreSQL in production, SQLite in development
    if os.environ.get('DATABASE_URL'):
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    
    # ... rest of your app configuration
```

### **Security Headers**
Add security headers to your Flask app:

```python
# In website/__init__.py
from flask_talisman import Talisman

def create_app():
    app = Flask(__name__)
    # ... your existing configuration
    
    # Add security headers
    Talisman(app, content_security_policy={
        'default-src': "'self'",
        'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
        'font-src': ["'self'", 'fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https:'],
    })
    
    return app
```

Add to `requirements.txt`:
```
flask-talisman==1.0.0
```

## 🔒 SSL/HTTPS Setup

### **Let's Encrypt (Free SSL)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Cloudflare (Alternative)**
1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable SSL/TLS encryption mode to "Full"

## 📊 Monitoring & Logging

### **Application Logging**
```python
# In main.py
import logging
from logging.handlers import RotatingFileHandler
import os

if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/smart-notes.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Smart Notes startup')
```

### **Health Check Endpoint**
```python
# In views.py
@views.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
```

## 🚀 Quick Deploy Commands

### **Heroku (One-liner)**
```bash
heroku create && git push heroku main && heroku open
```

### **Railway**
```bash
# Just push to GitHub, Railway auto-deploys
git push origin main
```

### **Render**
```bash
# Connect repo in Render dashboard, then:
git push origin main
```

## 🔍 Troubleshooting Deployment

### **Common Issues**

#### **Port Issues**
- Ensure your app listens on `0.0.0.0` in production
- Use environment variable for port: `os.environ.get('PORT', 5000)`

#### **Database Issues**
- Check database URL configuration
- Ensure database is accessible from deployment platform
- Run migrations after deployment

#### **Static Files**
- Ensure static files are properly served
- Check file permissions
- Use CDN for better performance

#### **Environment Variables**
- Verify all environment variables are set
- Check for typos in variable names
- Use platform-specific configuration methods

### **Debug Commands**

#### **Heroku**
```bash
# View logs
heroku logs --tail

# Run commands on Heroku
heroku run python init_db.py

# Check environment variables
heroku config
```

#### **Railway/Render**
- Check logs in platform dashboard
- Use platform CLI tools if available

## 📈 Performance Optimization

### **Database Optimization**
- Use connection pooling
- Implement database indexing
- Consider read replicas for high traffic

### **Caching**
- Implement Redis for session storage
- Use CDN for static assets
- Add response caching headers

### **Monitoring**
- Set up uptime monitoring
- Monitor application performance
- Track user analytics

---

**🎉 Your Smart Notes app is now ready for deployment!**

Choose the deployment option that best fits your needs and budget. Heroku and Railway are great for beginners, while VPS deployment offers more control for advanced users. 