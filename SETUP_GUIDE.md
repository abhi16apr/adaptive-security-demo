# 🚀 Adaptive Security Platform - Setup Guide

## Option 1: Quick Start (No Docker)

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### Step 1: Clone and Navigate
```bash
cd adaptive-security-demo
```

### Step 2: Set Up Database

#### On macOS/Linux:
```bash
# Create database
createdb adaptive_security

# Set environment variable
export DATABASE_URL="postgresql://postgres:password@localhost:5432/adaptive_security"
```

#### On Windows:
```bash
# Create database (in PostgreSQL shell)
createdb adaptive_security

# Set environment variable
set DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_security
```

### Step 3: Run Backend (Terminal 1)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize and seed database
flask init-db
flask seed-db

# Start server
python app.py
```

✅ Backend running on: http://localhost:5000

### Step 4: Run Frontend (Terminal 2)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running on: http://localhost:3000

### Step 5: Login

Go to http://localhost:3000 and login with:
- **Email**: admin@company.com
- **Password**: password

---

## Option 2: Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Quick Start
```bash
# From project root
docker-compose up

# In another terminal, initialize database
docker-compose exec backend flask init-db
docker-compose exec backend flask seed-db
```

✅ Access the application at http://localhost:3000

---

## 🎮 Demo Walkthrough

### 1. **Admin Dashboard** (Home Page)
- Overview of all security metrics
- Employee statistics
- Real-time threat count
- Training completion rates
- View all employees with risk levels

### 2. **Security Training** (Training Tab)
```bash
# Actions you can perform:
1. Click "Create New Training"
2. Fill in training details:
   - Title: "AI Security Fundamentals"
   - Category: "AI Threats"
   - Difficulty: "Beginner"
   - Content: Training material
3. Click "Create Training"
4. Select a training and assign to employees
```

### 3. **Phishing Simulations** (Phishing Tab)
```bash
# Actions you can perform:
1. Click "Create Campaign"
2. Fill in campaign details:
   - Name: "CEO Email Impersonation"
   - Email Subject: "Urgent: Please verify account"
   - Content: Phishing email body
   - Sender info
3. Click "Create Campaign"
4. Click "Launch Campaign" to send to all employees
5. View results showing click rates
```

### 4. **Email Security** (Email Security Tab)
```bash
# Actions you can perform:
1. Click "Add Threat Alert"
2. Fill in threat details:
   - Sender email: malicious@example.com
   - Threat type: Phishing
   - Confidence: 95%
3. Click "Add Threat"
4. View all detected threats
5. Click "Remediate" to handle threats
```

### 5. **View Employees**
- Go to Dashboard to see employee list
- Each employee shows:
  - Risk level (Low/Medium/High)
  - Training completion count
  - Phishing clicks
  - Department

---

## 📊 Sample Data

When you run `flask seed-db`, the system creates:

### Employees (5)
- john.smith@company.com (Sales)
- jane.doe@company.com (Marketing)
- bob.johnson@company.com (IT)
- alice.williams@company.com (Finance)
- charlie.brown@company.com (HR)

### Training Modules (4)
- Phishing Detection 101 (Beginner)
- AI Deepfakes and Voice Cloning (Intermediate)
- Data Security and Compliance (Intermediate)
- Password Security Best Practices (Beginner)

---

## 🧪 Testing Scenarios

### Scenario 1: Create and Send Phishing Campaign
1. Go to **Phishing Simulations**
2. Click **Create Campaign**
3. Fill with:
   - Name: "Bank Verification"
   - Subject: "Verify your banking details"
   - Body: "Click here to verify your account"
   - Sender: support@company.com
4. Click **Launch Campaign**
5. Click **View Results** to see statistics

### Scenario 2: Track Training Progress
1. Go to **Training**
2. Create a new training module
3. Assign it to employees
4. Go to **Dashboard** to see training completion metrics increase

### Scenario 3: Detect Email Threats
1. Go to **Email Security**
2. Click **Add Threat Alert**
3. Add multiple threats with different types
4. See threat analytics on the dashboard
5. Click **Remediate** to handle threats

---

## 🔧 Troubleshooting

### PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL if not running
# macOS:
brew services start postgresql
```

### Port Already in Use

**For Backend (Port 5000):**
```bash
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows (PowerShell):
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**For Frontend (Port 3000):**
```bash
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Errors
If you get CORS errors, make sure:
1. Backend is running on http://localhost:5000
2. Frontend is running on http://localhost:3000
3. Browser console shows the actual error

### Database Connection Refused
```bash
# Reset database
dropdb adaptive_security
createdb adaptive_security

# Re-initialize
cd backend
flask init-db
flask seed-db
```

---

## 📚 API Testing with curl

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password"
  }'
```

### Get All Employees
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Training
```bash
curl -X POST http://localhost:5000/api/trainings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Training",
    "category": "phishing",
    "description": "Learn about phishing",
    "content": "Training content here",
    "duration_minutes": 20,
    "difficulty": "beginner"
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Next Steps

1. **Customize branding** in `App.css`
2. **Modify sample data** in `backend/app.py` (seed_db function)
3. **Add more training categories**
4. **Integrate with real email system**
5. **Add user roles and permissions**
6. **Implement data export/reports**
7. **Add notifications and alerts**
8. **Create mobile app**

---

## 🎓 Learning Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://react.dev/
- **SQLAlchemy**: https://www.sqlalchemy.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT Authentication**: https://jwt.io/

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Can see dashboard with stats
- [ ] Can view employees list
- [ ] Can create training module
- [ ] Can create phishing campaign
- [ ] Can view email threats
- [ ] Database populated with sample data

---

## 🆘 Need Help?

Check the main README.md for detailed API documentation and architecture overview!

Happy learning! 🎉
