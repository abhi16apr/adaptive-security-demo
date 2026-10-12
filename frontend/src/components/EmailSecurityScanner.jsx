import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function EmailSecurityScanner() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddThreatModal, setShowAddThreatModal] = useState(false);
  const [newThreat, setNewThreat] = useState({
    sender_email: '',
    recipient_email: '',
    subject: '',
    threat_type: 'phishing',
    confidence: 85,
    action: 'quarantined',
    details: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [threatsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/email-security/threats`),
        axios.get(`${API_URL}/email-security/stats`)
      ]);
      setThreats(threatsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load email security data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddThreat = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/email-security/threats`, newThreat);
      setThreats([response.data, ...threats]);
      setShowAddThreatModal(false);
      setNewThreat({
        sender_email: '',
        recipient_email: '',
        subject: '',
        threat_type: 'phishing',
        confidence: 85,
        action: 'quarantined',
        details: ''
      });
    } catch (err) {
      setError('Failed to add threat');
    }
  };

  const handleRemediate = async (threatId) => {
    try {
      const response = await axios.post(`${API_URL}/email-security/threats/${threatId}/remediate`);
      setThreats(threats.map(t => t.id === threatId ? response.data : t));
      alert('Threat remediated successfully');
    } catch (err) {
      setError('Failed to remediate threat');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>Email Security</h1>
        <button className="btn btn-primary" onClick={() => setShowAddThreatModal(true)}>
          Add Threat Alert
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Threats Detected</h3>
          <div className="value">{stats?.total_threats || 0}</div>
          <div className="label">All-time detections</div>
        </div>

        <div className="stat-box">
          <h3>Threats Today</h3>
          <div className="value">{stats?.threats_today || 0}</div>
          <div className="label">Last 24 hours</div>
        </div>

        <div className="stat-box">
          <h3>Detection Rate</h3>
          <div className="value">99.2%</div>
          <div className="label">Emails analyzed</div>
        </div>

        <div className="stat-box">
          <h3>Remediation Status</h3>
          <div className="value">100%</div>
          <div className="label">Threats handled</div>
        </div>
      </div>

      {/* Threat Types Distribution */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="card-header">Threat Types</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {stats?.threat_types && Object.entries(stats.threat_types).map(([type, count]) => (
            <div key={type} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                {count}
              </div>
              <div style={{ fontSize: '14px', color: '#666', textTransform: 'capitalize' }}>
                {type.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Threat Modal */}
      <div className={`modal ${showAddThreatModal ? 'show' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <span>Add Email Threat Alert</span>
            <button className="close-btn" onClick={() => setShowAddThreatModal(false)}>×</button>
          </div>
          <form onSubmit={handleAddThreat}>
            <div className="form-group">
              <label>Sender Email</label>
              <input
                type="email"
                value={newThreat.sender_email}
                onChange={(e) => setNewThreat({ ...newThreat, sender_email: e.target.value })}
                placeholder="attacker@malicious.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Recipient Email</label>
              <input
                type="email"
                value={newThreat.recipient_email}
                onChange={(e) => setNewThreat({ ...newThreat, recipient_email: e.target.value })}
                placeholder="employee@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Subject</label>
              <input
                type="text"
                value={newThreat.subject}
                onChange={(e) => setNewThreat({ ...newThreat, subject: e.target.value })}
                placeholder="Urgent: Action Required"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Threat Type</label>
                <select
                  value={newThreat.threat_type}
                  onChange={(e) => setNewThreat({ ...newThreat, threat_type: e.target.value })}
                >
                  <option value="phishing">Phishing</option>
                  <option value="malware">Malware</option>
                  <option value="spoof">Spoofing</option>
                  <option value="extortion">Extortion</option>
                  <option value="bec">Business Email Compromise</option>
                </select>
              </div>
              <div className="form-group">
                <label>Confidence Level</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newThreat.confidence}
                  onChange={(e) => setNewThreat({ ...newThreat, confidence: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Action Taken</label>
              <select
                value={newThreat.action}
                onChange={(e) => setNewThreat({ ...newThreat, action: e.target.value })}
              >
                <option value="quarantined">Quarantined</option>
                <option value="blocked">Blocked</option>
                <option value="remediated">Remediated</option>
              </select>
            </div>

            <div className="form-group">
              <label>Details</label>
              <textarea
                value={newThreat.details}
                onChange={(e) => setNewThreat({ ...newThreat, details: e.target.value })}
                rows="3"
                placeholder="Additional threat details..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Add Threat</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddThreatModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Threats Table */}
      <div className="card">
        <div className="card-header">Detected Threats</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Confidence</th>
                <th>Action</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat) => (
                <tr key={threat.id}>
                  <td style={{ fontSize: '12px' }}>{threat.sender_email}</td>
                  <td style={{ fontSize: '12px' }}>{threat.recipient_email}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {threat.subject}
                  </td>
                  <td>
                    <span className="badge badge-danger" style={{ textTransform: 'capitalize' }}>
                      {threat.threat_type}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: threat.confidence > 80 ? '#ffe0e0' : threat.confidence > 60 ? '#fff3bf' : '#d3f9d8',
                      color: threat.confidence > 80 ? '#e03131' : threat.confidence > 60 ? '#f59f00' : '#2f9e44',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {threat.confidence}%
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                    <span className={`badge badge-${threat.action === 'remediated' ? 'success' : 'warning'}`}>
                      {threat.action}
                    </span>
                  </td>
                  <td>
                    {threat.action === 'quarantined' ? (
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => handleRemediate(threat.id)}
                      >
                        Remediate
                      </button>
                    ) : (
                      <span className="badge badge-success">✓ Handled</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(threat.detected_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {threats.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999' }}>No threats detected. System is secure!</p>
        </div>
      )}
    </div>
  );
}

export default EmailSecurityScanner;
