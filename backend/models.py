from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    """Admin user model"""
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Employee(db.Model):
    """Employee model"""
    __tablename__ = 'employees'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    risk_level = db.Column(db.String(50), default='medium')  # low, medium, high
    training_completed = db.Column(db.Integer, default=0)
    phishing_clicked = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'department': self.department,
            'risk_level': self.risk_level,
            'training_completed': self.training_completed,
            'phishing_clicked': self.phishing_clicked,
            'created_at': self.created_at.isoformat()
        }

class Training(db.Model):
    """Security training module"""
    __tablename__ = 'trainings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # phishing, deepfakes, ai_threats, compliance
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    duration_minutes = db.Column(db.Integer, default=10)
    difficulty = db.Column(db.String(50), default='beginner')  # beginner, intermediate, advanced
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'content': self.content,
            'duration_minutes': self.duration_minutes,
            'difficulty': self.difficulty,
            'created_at': self.created_at.isoformat()
        }

class EmployeeTraining(db.Model):
    """Employee training progress"""
    __tablename__ = 'employee_trainings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    training_id = db.Column(db.String(36), db.ForeignKey('trainings.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    score = db.Column(db.Integer)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    employee = db.relationship('Employee')
    training = db.relationship('Training')

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'training_id': self.training_id,
            'completed': self.completed,
            'score': self.score,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class PhishingCampaign(db.Model):
    """Phishing simulation campaign"""
    __tablename__ = 'phishing_campaigns'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    email_subject = db.Column(db.String(200), nullable=False)
    email_body = db.Column(db.Text, nullable=False)
    sender_name = db.Column(db.String(120), nullable=False)
    sender_email = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), default='draft')  # draft, sent, completed
    total_sent = db.Column(db.Integer, default=0)
    total_clicked = db.Column(db.Integer, default=0)
    total_reported = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sent_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'email_subject': self.email_subject,
            'sender_name': self.sender_name,
            'sender_email': self.sender_email,
            'status': self.status,
            'total_sent': self.total_sent,
            'total_clicked': self.total_clicked,
            'total_reported': self.total_reported,
            'click_rate': round((self.total_clicked / self.total_sent * 100) if self.total_sent > 0 else 0, 2),
            'created_at': self.created_at.isoformat(),
            'sent_at': self.sent_at.isoformat() if self.sent_at else None
        }

class PhishingResult(db.Model):
    """Result of phishing simulation for each employee"""
    __tablename__ = 'phishing_results'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_id = db.Column(db.String(36), db.ForeignKey('phishing_campaigns.id'), nullable=False)
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'), nullable=False)
    clicked = db.Column(db.Boolean, default=False)
    reported = db.Column(db.Boolean, default=False)
    clicked_at = db.Column(db.DateTime)
    reported_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    campaign = db.relationship('PhishingCampaign')
    employee = db.relationship('Employee')

    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'employee_id': self.employee_id,
            'clicked': self.clicked,
            'reported': self.reported,
            'clicked_at': self.clicked_at.isoformat() if self.clicked_at else None,
            'reported_at': self.reported_at.isoformat() if self.reported_at else None,
            'created_at': self.created_at.isoformat()
        }

class EmailThreat(db.Model):
    """Email security threat detection"""
    __tablename__ = 'email_threats'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_email = db.Column(db.String(120), nullable=False)
    recipient_email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    threat_type = db.Column(db.String(50), nullable=False)  # phishing, malware, spoof, extortion, bec
    confidence = db.Column(db.Integer, nullable=False)  # 0-100
    action = db.Column(db.String(50), default='quarantined')  # quarantined, blocked, remediated
    details = db.Column(db.Text)
    detected_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'sender_email': self.sender_email,
            'recipient_email': self.recipient_email,
            'subject': self.subject,
            'threat_type': self.threat_type,
            'confidence': self.confidence,
            'action': self.action,
            'details': self.details,
            'detected_at': self.detected_at.isoformat()
        }

class AIGovernanceLog(db.Model):
    """AI tool usage monitoring"""
    __tablename__ = 'ai_governance_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = db.Column(db.String(36), db.ForeignKey('employees.id'))
    ai_tool = db.Column(db.String(120), nullable=False)  # ChatGPT, Claude, etc
    prompt_preview = db.Column(db.Text)
    risk_level = db.Column(db.String(50))  # low, medium, high
    sensitive_data_detected = db.Column(db.Boolean, default=False)
    data_types = db.Column(db.String(500))  # comma-separated: credentials, pii, secrets
    action = db.Column(db.String(50), default='logged')  # logged, flagged, blocked
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    employee = db.relationship('Employee')

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'ai_tool': self.ai_tool,
            'prompt_preview': self.prompt_preview,
            'risk_level': self.risk_level,
            'sensitive_data_detected': self.sensitive_data_detected,
            'data_types': self.data_types,
            'action': self.action,
            'timestamp': self.timestamp.isoformat()
        }
