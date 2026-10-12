# Adaptive Security Platform - Demo

A full-stack security training and phishing simulation platform inspired by Adaptive Security. This demo includes security awareness training, phishing simulations, email threat detection, and AI governance features.

## 🏗️ Architecture

- **Frontend**: React 18 with modern UI components
- **Backend**: Python Flask with SQLAlchemy ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication

## 🎯 Features

### 1. **Admin Dashboard**
- Real-time security metrics
- Employee overview with risk levels
- Training completion rates
- Phishing campaign statistics
- Email threat detection stats
- Quick action buttons

### 2. **Security Training**
- Create and manage training modules
- 4 categories: Phishing, Deepfakes, AI Threats, Compliance
- Track employee progress
- Difficulty levels: Beginner, Intermediate, Advanced
- Automated completion tracking

### 3. **Phishing Simulations**
- Create realistic phishing campaigns
- Target specific employees or all staff
- Track click-through rates
- Monitor reporting behavior
- Detailed campaign analytics

### 4. **Email Security**
- Real-time threat detection
- 5 threat types: Phishing, Malware, Spoofing, Extortion, BEC
- Automatic quarantine and remediation
- Confidence scoring
- Threat analytics dashboard

### 5. **AI Governance**
- Monitor AI tool usage (ChatGPT, Claude, etc.)
- Detect sensitive data exposure
- Flag risky prompts
- Automated logging and alerting

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Set Up Database

```bash
# Create PostgreSQL database
createdb adaptive_security

# Set environment variable (Linux/Mac)
export DATABASE_URL="postgresql://postgres:password@localhost:5432/adaptive_security"

# Or on Windows
set DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_security
```

### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
flask init-db

# Seed sample data
flask seed-db

# Run server
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

```
Email: admin@company.com
Password: password
```

**Note**: Change these credentials in production!

## 📁 Project Structure

```
adaptive-security-demo/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── models.py           # SQLAlchemy database models
│   ├── requirements.txt     # Python dependencies
│   └── database.sql        # SQL schema (if needed)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main App component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # Entry point
│   │   ├── pages/
│   │   │   └── LoginPage.jsx    # Login/Signup page
│   │   └── components/
│   │       ├── Navigation.jsx         # Navigation bar
│   │       ├── AdminDashboard.jsx     # Main dashboard
│   │       ├── TrainingDashboard.jsx  # Training management
│   │       ├── PhishingSimulation.jsx # Phishing campaigns
│   │       └── EmailSecurityScanner.jsx # Email threats
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── package.json         # Node dependencies
│   └── .env                 # Environment variables
│
└── README.md               # This file
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/{id}` - Get employee details
- `PUT /api/employees/{id}` - Update employee

### Training
- `GET /api/trainings` - List trainings
- `POST /api/trainings` - Create training
- `POST /api/employees/{emp_id}/trainings/{train_id}/start` - Start training
- `POST /api/employees/{emp_id}/trainings/{train_id}/complete` - Complete training

### Phishing Campaigns
- `GET /api/phishing/campaigns` - List campaigns
- `POST /api/phishing/campaigns` - Create campaign
- `POST /api/phishing/campaigns/{id}/launch` - Launch campaign
- `GET /api/phishing/campaigns/{id}/results` - Get campaign results
- `POST /api/phishing/results/{id}/click` - Record click
- `POST /api/phishing/results/{id}/report` - Record report

### Email Security
- `GET /api/email-security/threats` - List threats
- `POST /api/email-security/threats` - Add threat
- `POST /api/email-security/threats/{id}/remediate` - Remediate threat
- `GET /api/email-security/stats` - Get statistics

### AI Governance
- `GET /api/ai-governance/logs` - List logs
- `POST /api/ai-governance/logs` - Create log entry

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🛠️ Development

### Add a New Feature

1. Create database model in `backend/models.py`
2. Add Flask routes in `backend/app.py`
3. Create React component in `frontend/src/components/`
4. Add routes in `frontend/src/App.jsx`
5. Test with API and UI

### Database Migrations

To update the database schema:

```bash
# In backend directory
cd backend
flask init-db  # Recreate tables
flask seed-db  # Reseed sample data
```

## 📊 Sample Data

The system comes with seed data including:
- 5 sample employees across departments
- 4 security training modules
- Sample threat data
- Pre-configured security scenarios

Run `flask seed-db` to populate this data.

## 🔒 Security Considerations

1. **Change default credentials** before production use
2. **Enable HTTPS** in production
3. **Set strong JWT_SECRET_KEY** in config
4. **Use environment variables** for sensitive data
5. **Implement rate limiting** on API endpoints
6. **Add input validation** for all forms
7. **Set CORS** restrictions appropriately
8. **Use database backups** regularly

## 🐛 Troubleshooting

### Database Connection Error
```
Error: could not translate host name "localhost" to address
```
**Solution**: Ensure PostgreSQL is running and the DATABASE_URL is correct

### Port Already in Use
```
Address already in use
```
**Solution**: 
- Backend: `lsof -i :5000` then kill the process
- Frontend: `lsof -i :3000` then kill the process

### CORS Errors
**Solution**: Ensure backend is running on port 5000 and frontend on 3000, or update CORS settings in `app.py`

### Authentication Fails
**Solution**: Clear browser localStorage and try logging in again

## 📈 Scaling for Production

1. **Use Docker** for containerization
2. **Implement Redis** for caching
3. **Add Elasticsearch** for threat logs
4. **Use Nginx** as reverse proxy
5. **Implement CI/CD** pipeline
6. **Add comprehensive logging** and monitoring
7. **Set up automated backups**
8. **Implement two-factor authentication**

## 📝 License

This is a demo project for educational purposes.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📞 Support

For issues or questions, refer to the inline code documentation or reach out for help.

---

**Built with ❤️ for cybersecurity education**
