from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import os
from config import DevelopmentConfig
from models import db, User, Employee, Training, EmployeeTraining, PhishingCampaign, PhishingResult, EmailThreat, AIGovernanceLog
import uuid

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# ============ Authentication Routes ============

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new admin user"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        email=data['email'],
        full_name=data.get('full_name', 'Admin'),
        role=data.get('role', 'admin')
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login admin user"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200

# ============ Employee Routes ============

@app.route('/api/employees', methods=['GET'])
@jwt_required()
def get_employees():
    """Get all employees"""
    employees = Employee.query.all()
    return jsonify([emp.to_dict() for emp in employees]), 200

@app.route('/api/employees', methods=['POST'])
@jwt_required()
def create_employee():
    """Create new employee"""
    data = request.get_json()

    if Employee.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Employee email already exists'}), 400

    employee = Employee(
        email=data['email'],
        full_name=data['full_name'],
        department=data.get('department', 'General')
    )

    db.session.add(employee)
    db.session.commit()

    return jsonify(employee.to_dict()), 201

@app.route('/api/employees/<employee_id>', methods=['GET'])
@jwt_required()
def get_employee(employee_id):
    """Get employee by ID"""
    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({'error': 'Employee not found'}), 404

    emp_data = employee.to_dict()

    # Add training progress
    trainings = EmployeeTraining.query.filter_by(employee_id=employee_id).all()
    emp_data['trainings'] = [t.to_dict() for t in trainings]

    # Add phishing results
    phishing = PhishingResult.query.filter_by(employee_id=employee_id).all()
    emp_data['phishing_results'] = [p.to_dict() for p in phishing]

    return jsonify(emp_data), 200

@app.route('/api/employees/<employee_id>', methods=['PUT'])
@jwt_required()
def update_employee(employee_id):
    """Update employee"""
    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({'error': 'Employee not found'}), 404

    data = request.get_json()

    if 'full_name' in data:
        employee.full_name = data['full_name']
    if 'department' in data:
        employee.department = data['department']
    if 'risk_level' in data:
        employee.risk_level = data['risk_level']

    db.session.commit()

    return jsonify(employee.to_dict()), 200

# ============ Training Routes ============

@app.route('/api/trainings', methods=['GET'])
@jwt_required()
def get_trainings():
    """Get all trainings"""
    trainings = Training.query.all()
    return jsonify([t.to_dict() for t in trainings]), 200

@app.route('/api/trainings', methods=['POST'])
@jwt_required()
def create_training():
    """Create new training"""
    data = request.get_json()

    training = Training(
        title=data['title'],
        category=data['category'],
        description=data['description'],
        content=data['content'],
        duration_minutes=data.get('duration_minutes', 10),
        difficulty=data.get('difficulty', 'beginner')
    )

    db.session.add(training)
    db.session.commit()

    return jsonify(training.to_dict()), 201

@app.route('/api/employees/<employee_id>/trainings/<training_id>/start', methods=['POST'])
@jwt_required()
def start_training(employee_id, training_id):
    """Start training for employee"""
    employee = Employee.query.get(employee_id)
    training = Training.query.get(training_id)

    if not employee or not training:
        return jsonify({'error': 'Employee or training not found'}), 404

    # Check if already exists
    existing = EmployeeTraining.query.filter_by(
        employee_id=employee_id,
        training_id=training_id
    ).first()

    if existing:
        return jsonify(existing.to_dict()), 200

    emp_training = EmployeeTraining(
        employee_id=employee_id,
        training_id=training_id
    )

    db.session.add(emp_training)
    db.session.commit()

    return jsonify(emp_training.to_dict()), 201

@app.route('/api/employees/<employee_id>/trainings/<training_id>/complete', methods=['POST'])
@jwt_required()
def complete_training(employee_id, training_id):
    """Complete training for employee"""
    data = request.get_json() or {}
    score = data.get('score', 100)

    emp_training = EmployeeTraining.query.filter_by(
        employee_id=employee_id,
        training_id=training_id
    ).first()

    if not emp_training:
        return jsonify({'error': 'Training progress not found'}), 404

    emp_training.completed = True
    emp_training.score = score
    emp_training.completed_at = datetime.utcnow()

    employee = Employee.query.get(employee_id)
    employee.training_completed += 1

    db.session.commit()

    return jsonify(emp_training.to_dict()), 200

# ============ Phishing Campaign Routes ============

@app.route('/api/phishing/campaigns', methods=['GET'])
@jwt_required()
def get_phishing_campaigns():
    """Get all phishing campaigns"""
    campaigns = PhishingCampaign.query.all()
    return jsonify([c.to_dict() for c in campaigns]), 200

@app.route('/api/phishing/campaigns', methods=['POST'])
@jwt_required()
def create_phishing_campaign():
    """Create new phishing campaign"""
    data = request.get_json()

    campaign = PhishingCampaign(
        name=data['name'],
        description=data.get('description'),
        email_subject=data['email_subject'],
        email_body=data['email_body'],
        sender_name=data['sender_name'],
        sender_email=data['sender_email']
    )

    db.session.add(campaign)
    db.session.commit()

    return jsonify(campaign.to_dict()), 201

@app.route('/api/phishing/campaigns/<campaign_id>/launch', methods=['POST'])
@jwt_required()
def launch_phishing_campaign(campaign_id):
    """Launch a phishing campaign to employees"""
    data = request.get_json() or {}
    employee_ids = data.get('employee_ids', [])

    campaign = PhishingCampaign.query.get(campaign_id)

    if not campaign:
        return jsonify({'error': 'Campaign not found'}), 404

    # If no specific employees, target all
    if not employee_ids:
        employees = Employee.query.all()
        employee_ids = [e.id for e in employees]

    # Create results for each employee
    for emp_id in employee_ids:
        result = PhishingResult(
            campaign_id=campaign_id,
            employee_id=emp_id
        )
        db.session.add(result)

    campaign.status = 'sent'
    campaign.sent_at = datetime.utcnow()
    campaign.total_sent = len(employee_ids)

    db.session.commit()

    return jsonify(campaign.to_dict()), 200

@app.route('/api/phishing/campaigns/<campaign_id>/results', methods=['GET'])
@jwt_required()
def get_campaign_results(campaign_id):
    """Get phishing campaign results"""
    results = PhishingResult.query.filter_by(campaign_id=campaign_id).all()

    # Get employee details for each result
    detailed_results = []
    for result in results:
        emp = Employee.query.get(result.employee_id)
        res_dict = result.to_dict()
        res_dict['employee'] = emp.to_dict()
        detailed_results.append(res_dict)

    return jsonify(detailed_results), 200

@app.route('/api/phishing/results/<result_id>/click', methods=['POST'])
@jwt_required()
def record_phishing_click(result_id):
    """Record that employee clicked phishing link"""
    result = PhishingResult.query.get(result_id)

    if not result:
        return jsonify({'error': 'Result not found'}), 404

    result.clicked = True
    result.clicked_at = datetime.utcnow()

    # Update campaign stats
    campaign = result.campaign
    campaign.total_clicked = len(PhishingResult.query.filter_by(
        campaign_id=campaign.id,
        clicked=True
    ).all())

    # Update employee stats
    employee = result.employee
    employee.phishing_clicked += 1

    db.session.commit()

    return jsonify(result.to_dict()), 200

@app.route('/api/phishing/results/<result_id>/report', methods=['POST'])
@jwt_required()
def record_phishing_report(result_id):
    """Record that employee reported phishing"""
    result = PhishingResult.query.get(result_id)

    if not result:
        return jsonify({'error': 'Result not found'}), 404

    result.reported = True
    result.reported_at = datetime.utcnow()

    # Update campaign stats
    campaign = result.campaign
    campaign.total_reported = len(PhishingResult.query.filter_by(
        campaign_id=campaign.id,
        reported=True
    ).all())

    db.session.commit()

    return jsonify(result.to_dict()), 200

# ============ Email Security Routes ============

@app.route('/api/email-security/threats', methods=['GET'])
@jwt_required()
def get_email_threats():
    """Get detected email threats"""
    threats = EmailThreat.query.order_by(EmailThreat.detected_at.desc()).all()
    return jsonify([t.to_dict() for t in threats]), 200

@app.route('/api/email-security/threats', methods=['POST'])
@jwt_required()
def create_email_threat():
    """Simulate detecting an email threat"""
    data = request.get_json()

    threat = EmailThreat(
        sender_email=data['sender_email'],
        recipient_email=data['recipient_email'],
        subject=data['subject'],
        threat_type=data['threat_type'],
        confidence=data.get('confidence', 85),
        action=data.get('action', 'quarantined'),
        details=data.get('details')
    )

    db.session.add(threat)
    db.session.commit()

    return jsonify(threat.to_dict()), 201

@app.route('/api/email-security/threats/<threat_id>/remediate', methods=['POST'])
@jwt_required()
def remediate_threat(threat_id):
    """Remediate email threat"""
    threat = EmailThreat.query.get(threat_id)

    if not threat:
        return jsonify({'error': 'Threat not found'}), 404

    threat.action = 'remediated'
    db.session.commit()

    return jsonify(threat.to_dict()), 200

@app.route('/api/email-security/stats', methods=['GET'])
@jwt_required()
def get_email_security_stats():
    """Get email security statistics"""
    total_threats = EmailThreat.query.count()
    threats_today = EmailThreat.query.filter(
        EmailThreat.detected_at >= datetime.utcnow() - timedelta(days=1)
    ).count()

    threat_types = {}
    for threat in EmailThreat.query.all():
        threat_types[threat.threat_type] = threat_types.get(threat.threat_type, 0) + 1

    return jsonify({
        'total_threats': total_threats,
        'threats_today': threats_today,
        'threat_types': threat_types
    }), 200

# ============ AI Governance Routes ============

@app.route('/api/ai-governance/logs', methods=['GET'])
@jwt_required()
def get_ai_governance_logs():
    """Get AI governance logs"""
    logs = AIGovernanceLog.query.order_by(AIGovernanceLog.timestamp.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200

@app.route('/api/ai-governance/logs', methods=['POST'])
@jwt_required()
def create_ai_governance_log():
    """Log AI tool usage"""
    data = request.get_json()

    log = AIGovernanceLog(
        employee_id=data.get('employee_id'),
        ai_tool=data['ai_tool'],
        prompt_preview=data.get('prompt_preview'),
        risk_level=data.get('risk_level', 'medium'),
        sensitive_data_detected=data.get('sensitive_data_detected', False),
        data_types=data.get('data_types'),
        action=data.get('action', 'logged')
    )

    db.session.add(log)
    db.session.commit()

    return jsonify(log.to_dict()), 201

# ============ Dashboard Stats Routes ============

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get overall dashboard statistics"""
    total_employees = Employee.query.count()
    total_trainings = Training.query.count()
    completed_trainings = EmployeeTraining.query.filter_by(completed=True).count()

    active_campaigns = PhishingCampaign.query.filter_by(status='sent').count()
    total_phishing_results = PhishingResult.query.count()
    clicked_phishing = PhishingResult.query.filter_by(clicked=True).count()

    email_threats = EmailThreat.query.count()

    avg_risk_level = 'medium'
    high_risk_employees = Employee.query.filter_by(risk_level='high').count()

    return jsonify({
        'total_employees': total_employees,
        'total_trainings': total_trainings,
        'completed_trainings': completed_trainings,
        'training_completion_rate': round((completed_trainings / (total_employees * total_trainings) * 100) if total_trainings > 0 else 0, 2),
        'active_campaigns': active_campaigns,
        'total_phishing_results': total_phishing_results,
        'clicked_phishing': clicked_phishing,
        'phishing_click_rate': round((clicked_phishing / total_phishing_results * 100) if total_phishing_results > 0 else 0, 2),
        'email_threats': email_threats,
        'high_risk_employees': high_risk_employees,
        'avg_risk_level': avg_risk_level
    }), 200

# ============ Error Handlers ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ============ Database Initialization ============

@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print('Database initialized!')

@app.cli.command()
def seed_db():
    """Seed the database with sample data"""
    # Create sample trainings
    trainings_data = [
        {
            'title': 'Phishing Detection 101',
            'category': 'phishing',
            'description': 'Learn to identify phishing emails and attacks',
            'content': 'This module covers common phishing tactics...',
            'duration_minutes': 15,
            'difficulty': 'beginner'
        },
        {
            'title': 'AI Deepfakes and Voice Cloning',
            'category': 'deepfakes',
            'description': 'Understanding AI-generated deepfakes and voice cloning attacks',
            'content': 'Deepfakes are synthetic media created using AI...',
            'duration_minutes': 20,
            'difficulty': 'intermediate'
        },
        {
            'title': 'Data Security and Compliance',
            'category': 'compliance',
            'description': 'GDPR, HIPAA, and SOX compliance requirements',
            'content': 'This training covers regulatory compliance...',
            'duration_minutes': 30,
            'difficulty': 'intermediate'
        },
        {
            'title': 'Password Security Best Practices',
            'category': 'ai_threats',
            'description': 'Create strong passwords and manage them securely',
            'content': 'Strong passwords are the first line of defense...',
            'duration_minutes': 10,
            'difficulty': 'beginner'
        }
    ]

    for t_data in trainings_data:
        if not Training.query.filter_by(title=t_data['title']).first():
            training = Training(**t_data)
            db.session.add(training)

    # Create sample employees
    employees_data = [
        {'email': 'john.smith@company.com', 'full_name': 'John Smith', 'department': 'Sales'},
        {'email': 'jane.doe@company.com', 'full_name': 'Jane Doe', 'department': 'Marketing'},
        {'email': 'bob.johnson@company.com', 'full_name': 'Bob Johnson', 'department': 'IT'},
        {'email': 'alice.williams@company.com', 'full_name': 'Alice Williams', 'department': 'Finance'},
        {'email': 'charlie.brown@company.com', 'full_name': 'Charlie Brown', 'department': 'HR'},
    ]

    for e_data in employees_data:
        if not Employee.query.filter_by(email=e_data['email']).first():
            employee = Employee(**e_data)
            db.session.add(employee)

    db.session.commit()
    print('Database seeded with sample data!')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
