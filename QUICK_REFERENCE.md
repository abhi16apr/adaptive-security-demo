# ⚡ Quick Reference Card

## 🔑 Login
```
Email: admin@company.com
Password: password
```

## 🎯 Default Ports
- Backend API: http://localhost:5000
- Frontend UI: http://localhost:3000
- Database: localhost:5432

## 📋 Sample Employees
1. john.smith@company.com (Sales)
2. jane.doe@company.com (Marketing)  
3. bob.johnson@company.com (IT)
4. alice.williams@company.com (Finance)
5. charlie.brown@company.com (HR)

## 🎓 Sample Training Modules
1. Phishing Detection 101
2. AI Deepfakes and Voice Cloning
3. Data Security and Compliance
4. Password Security Best Practices

## 🎣 Threat Types
- Phishing
- Malware
- Spoofing
- Extortion
- Business Email Compromise (BEC)

## 📊 Dashboard Metrics
- Total Employees
- Training Completion Rate
- Phishing Click Rate
- Email Threats Detected
- High-Risk Employees
- Active Campaigns

## 🔐 Environment Variables

### Backend
```
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_security
JWT_SECRET_KEY=your-secret-key
FLASK_APP=app.py
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 One-Liner Commands

### Backend Setup
```bash
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && flask init-db && flask seed-db && python app.py
```

### Frontend Setup
```bash
cd frontend && npm install && npm start
```

### Docker Setup
```bash
docker-compose up && docker-compose exec backend flask init-db && docker-compose exec backend flask seed-db
```

## 🐛 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Database connection error | Check PostgreSQL is running: `brew services list` (macOS) |
| Port already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| CORS errors | Ensure ports 3000 and 5000 are correct |
| Module not found (pip) | Run: `pip install -r requirements.txt` |
| Module not found (npm) | Run: `npm install` |

## 📱 Key Workflows

### Create Training Module
Training → Create New Training → Fill details → Create → Assign to employees

### Launch Phishing Campaign  
Phishing → Create Campaign → Fill details → Launch Campaign → View Results

### Add Email Threat
Email Security → Add Threat Alert → Fill threat details → Add Threat

## 🔌 Core API Routes

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/employees
POST   /api/trainings
POST   /api/phishing/campaigns
POST   /api/phishing/campaigns/{id}/launch
GET    /api/email-security/threats
GET    /api/dashboard/stats
```

## 📦 Project Statistics

| Metric | Value |
|--------|-------|
| Backend Files | 5 |
| Frontend Components | 6 |
| Total React Components | 7 |
| Database Models | 8 |
| API Endpoints | 30+ |
| Total Lines of Code | 3750+ |

## 🎯 Feature Checklist

- [x] User Authentication
- [x] Employee Management
- [x] Security Training
- [x] Phishing Simulations
- [x] Email Security
- [x] AI Governance
- [x] Admin Dashboard
- [x] Real-time Statistics
- [x] Docker Support
- [x] Complete Documentation

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete overview & API docs |
| SETUP_GUIDE.md | Step-by-step setup instructions |
| PROJECT_SUMMARY.md | Project statistics & details |
| QUICK_REFERENCE.md | This file |

## 🎨 Color Scheme

- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Success: `#51cf66` (Green)
- Danger: `#ff6b6b` (Red)
- Warning: `#f59f00` (Orange)
- Info: `#0ca5eb` (Blue)

## 🔒 Default Database Connection

```
Driver: PostgreSQL
Host: localhost
Port: 5432
Database: adaptive_security
User: postgres
Password: password
```

## 💡 Pro Tips

1. **Reset Database**: `dropdb adaptive_security && createdb adaptive_security && flask init-db && flask seed-db`
2. **View Database**: Use pgAdmin or `psql -d adaptive_security`
3. **Frontend Debugging**: Open DevTools (F12) for console errors
4. **Backend Debugging**: Check Flask logs in terminal
5. **API Testing**: Use curl or Postman with Bearer token

## 🚦 Startup Sequence

1. ✅ Start PostgreSQL
2. ✅ Start Backend (Terminal 1)
3. ✅ Start Frontend (Terminal 2)
4. ✅ Open http://localhost:3000
5. ✅ Login with default credentials
6. ✅ Create/manage content

## 📞 File Locations

- Backend Code: `/backend/app.py`
- Database Models: `/backend/models.py`
- Frontend Components: `/frontend/src/components/`
- Styling: `/frontend/src/App.css`
- Configuration: `/backend/config.py`
- Environment: `/backend/.env` & `/frontend/.env`

## 🎓 Tech Stack Quick Links

- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/
- SQLAlchemy: https://www.sqlalchemy.org/
- Axios: https://axios-http.com/
- React Router: https://reactrouter.com/

---

**Last Updated**: 2026-10-12
**Version**: 1.0.0
**Status**: ✅ Complete & Ready to Deploy
