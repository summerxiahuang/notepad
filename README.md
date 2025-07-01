# Smart Notes - Modern Flask Notepad Application

A beautiful, feature-rich web-based notepad application built with Flask that allows users to create, manage, and organize their personal notes with a modern, responsive interface.

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure User Authentication**: Login and signup system with password hashing
- **Password Strength Indicator**: Real-time password strength validation
- **Session Management**: Persistent login sessions with remember me functionality
- **User Profile Management**: Personalized user experience with profile dropdown

### 📝 **Note Management**
- **Create & Delete Notes**: Add and remove notes with smooth animations
- **Real-time Statistics**: View total notes, today's notes, and weekly activity
- **Note Export**: Download all notes as a formatted text file
- **Bulk Operations**: Clear all notes with confirmation
- **Search Functionality**: Search through your notes (frontend implementation)
- **Auto-save**: Notes are saved automatically with timestamps

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful gradient backgrounds with glass effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Dark/Light Theme**: Modern color scheme with CSS variables
- **Bootstrap Icons**: Consistent iconography throughout the app
- **Toast Notifications**: Real-time feedback for user actions

### ⌨️ **Enhanced Interactions**
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter`: Submit note
  - `Ctrl/Cmd + K`: Open search
- **Auto-resizing Textarea**: Dynamic note input that grows with content
- **Password Visibility Toggle**: Show/hide passwords on forms
- **Loading States**: Visual feedback during form submissions
- **Confirmation Dialogs**: Safe deletion with user confirmation

## 🛠️ Tech Stack

### **Backend**
- **Flask 2.3.3**: Modern Python web framework
- **SQLAlchemy 3.0.5**: Advanced ORM for database operations
- **Flask-Login 0.6.3**: User session management
- **Gunicorn 21.2.0**: Production WSGI server

### **Frontend**
- **Bootstrap 5.3.0**: Modern CSS framework with responsive design
- **Bootstrap Icons 1.10.0**: Comprehensive icon library
- **Inter Font**: Modern, readable typography
- **Vanilla JavaScript**: ES6+ features for enhanced interactions

### **Database**
- **SQLite**: Lightweight, serverless database
- **SQLAlchemy ORM**: Object-relational mapping

### **Development Tools**
- **Flask Debug Mode**: Development server with auto-reload
- **Modern CSS**: CSS Grid, Flexbox, and CSS Variables
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## 📋 Prerequisites

- **Python 3.8+**: Modern Python with type hints support
- **pip**: Python package installer
- **Git**: Version control (optional but recommended)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notepad
   ```

2. **Create a virtual environment**
   ```bash
   python3 -m venv env
   ```

3. **Activate the virtual environment**
   ```bash
   # On macOS/Linux:
   source env/bin/activate
   
   # On Windows:
   env\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the database**
   ```bash
   python init_db.py
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Make sure your virtual environment is activated
source env/bin/activate

# Run the Flask development server
python main.py
```

The application will be available at `http://localhost:5000`

### Production Mode
```bash
# Using Gunicorn (production WSGI server)
gunicorn main:app
```

### Alternative Port (if 5000 is busy)
```bash
# Run on a different port
python -c "from main import app; app.run(debug=True, port=5001)"
```

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy Options:

**Heroku (Recommended for beginners):**
```bash
heroku create your-app-name
git push heroku main
heroku open
```

**Railway (Modern alternative):**
1. Connect your GitHub repo to [railway.app](https://railway.app)
2. Deploy automatically on push

**Render (Free tier available):**
1. Connect your GitHub repo to [render.com](https://render.com)
2. Configure as Web Service
3. Deploy automatically on push

## 📖 Usage Guide

### **Getting Started**
1. **Sign Up**: Create a new account with email, password, and first name
2. **Login**: Access your personalized notepad dashboard
3. **Create Notes**: Use the "Add New Note" form on the right sidebar
4. **Manage Notes**: View, delete, or export your notes

### **Advanced Features**
- **Statistics Dashboard**: View your note activity at a glance
- **Export Notes**: Download all notes as a formatted text file
- **Bulk Operations**: Clear all notes with confirmation dialog
- **Search**: Use `Ctrl/Cmd + K` to search through your notes
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter`: Submit note quickly
  - `Ctrl/Cmd + K`: Open search modal

### **User Interface**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Animations**: Smooth transitions and hover effects
- **Real-time Feedback**: Toast notifications for all actions
- **Profile Management**: Access settings and logout via user dropdown

## 📁 Project Structure

```
notepad/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies (updated for modern packages)
├── Procfile               # Heroku deployment configuration
├── init_db.py             # Database initialization script
├── README.md              # Comprehensive documentation
├── website/               # Main application package
│   ├── __init__.py        # Flask app factory with database setup
│   ├── models.py          # Database models (User, Note)
│   ├── views.py           # Enhanced routes with statistics and export
│   ├── auth.py            # Authentication routes with validation
│   ├── database.db        # SQLite database file (auto-generated)
│   ├── templates/         # Modern HTML templates
│   │   ├── base.html      # Base template with Bootstrap 5 and custom CSS
│   │   ├── home.html      # Dashboard with statistics and note management
│   │   ├── login.html     # Modern login form with password toggle
│   │   └── sign_up.html   # Enhanced signup with password strength
│   └── static/            # Static files
│       └── index.js       # Enhanced JavaScript with animations and features
└── env/                   # Virtual environment (not in repo)
```

## Database Models

### User Model
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password
- `first_name`: User's first name
- `notes`: Relationship to user's notes

### Note Model
- `id`: Primary key
- `data`: Note content (up to 10,000 characters)
- `date`: Creation timestamp
- `user_id`: Foreign key to User

## 🔌 API Endpoints

### **Core Routes**
- `GET /` - Dashboard with statistics (requires authentication)
- `POST /` - Create a new note
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /sign-up` - Sign up page
- `POST /sign-up` - Process sign up
- `GET /logout` - Logout user

### **Note Management**
- `POST /delete-note` - Delete a specific note
- `POST /clear-all-notes` - Delete all user notes
- `GET /export-notes` - Download notes as text file
- `GET /search-notes` - Search through notes (API endpoint)

### **Response Formats**
- **Success**: JSON with `{"success": true}`
- **Error**: JSON with `{"success": false, "error": "message"}`
- **File Download**: Text file for note exports

## 🔧 Troubleshooting

### **Port 5000 Already in Use**
If you get an "Address already in use" error on port 5000:

**On macOS:**
- Disable AirPlay Receiver in System Preferences → Sharing
- Or run the app on a different port:
  ```bash
  python -c "from main import app; app.run(debug=True, port=5001)"
  ```

**On Linux/Windows:**
- Find and stop the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### **Database Issues**
If you encounter database errors:
```bash
# Reinitialize the database
python init_db.py
```

### **Virtual Environment Issues**
If you have dependency issues:
```bash
# Deactivate and reactivate virtual environment
deactivate
source env/bin/activate
pip install -r requirements.txt
```

### **Import Errors**
If you see "ModuleNotFoundError" for Flask:
```bash
# Make sure virtual environment is activated
source env/bin/activate
pip install -r requirements.txt
```

### **CSS/JavaScript Not Loading**
- Clear browser cache (Ctrl/Cmd + Shift + R)
- Check browser console for errors
- Ensure all static files are in the correct location

## 🔒 Security Features

### **Authentication & Authorization**
- **Password Hashing**: SHA-256 with salt for secure password storage
- **Session Management**: Flask-Login for secure user sessions
- **User Isolation**: Each user can only access their own notes
- **Login Required**: Protected routes with authentication decorators

### **Input Validation**
- **Form Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **XSS Protection**: Jinja2 auto-escaping and input sanitization
- **CSRF Protection**: Built-in CSRF protection in Flask

### **Data Security**
- **Secure Headers**: Modern security headers implementation
- **HTTPS Ready**: Configured for secure connections
- **Environment Variables**: Sensitive data stored in environment variables

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Submit a pull request**

### **Development Guidelines**
- Follow PEP 8 Python style guidelines
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

### **Getting Help**
- **Issues**: Open an issue on the project repository
- **Documentation**: Check this README for common solutions
- **Community**: Join our discussions for help and ideas

### **Feature Requests**
We love new ideas! Please open an issue with:
- Clear description of the feature
- Use case and benefits
- Any mockups or examples

---

**Made with ❤️ using Flask and modern web technologies** 