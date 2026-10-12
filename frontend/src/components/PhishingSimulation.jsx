import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function PhishingSimulation() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    email_subject: '',
    email_body: '',
    sender_name: '',
    sender_email: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/phishing/campaigns`);
      setCampaigns(response.data);
    } catch (err) {
      setError('Failed to load campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/phishing/campaigns`, newCampaign);
      setCampaigns([...campaigns, response.data]);
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        description: '',
        email_subject: '',
        email_body: '',
        sender_name: '',
        sender_email: ''
      });
    } catch (err) {
      setError('Failed to create campaign');
    }
  };

  const handleLaunchCampaign = async (campaignId) => {
    try {
      const response = await axios.post(`${API_URL}/phishing/campaigns/${campaignId}/launch`);
      setCampaigns(campaigns.map(c => c.id === campaignId ? response.data : c));
      alert('Campaign launched successfully!');
    } catch (err) {
      setError('Failed to launch campaign');
    }
  };

  const fetchCampaignResults = async (campaignId) => {
    try {
      const response = await axios.get(`${API_URL}/phishing/campaigns/${campaignId}/results`);
      const campaign = campaigns.find(c => c.id === campaignId);
      setSelectedCampaign({ ...campaign, results: response.data });
    } catch (err) {
      setError('Failed to load campaign results');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>Phishing Simulations</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Create Campaign
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Create Campaign Modal */}
      <div className={`modal ${showCreateModal ? 'show' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <span>Create Phishing Campaign</span>
            <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
          </div>
          <form onSubmit={handleCreateCampaign}>
            <div className="form-group">
              <label>Campaign Name</label>
              <input
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="e.g., CEO Impersonation Test"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Email Subject</label>
              <input
                type="text"
                value={newCampaign.email_subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, email_subject: e.target.value })}
                placeholder="Urgent: Please verify your account"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Body</label>
              <textarea
                value={newCampaign.email_body}
                onChange={(e) => setNewCampaign({ ...newCampaign, email_body: e.target.value })}
                rows="5"
                placeholder="Enter the email content that will be sent to employees..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Sender Name</label>
                <input
                  type="text"
                  value={newCampaign.sender_name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, sender_name: e.target.value })}
                  placeholder="John CEO"
                  required
                />
              </div>
              <div className="form-group">
                <label>Sender Email</label>
                <input
                  type="email"
                  value={newCampaign.sender_email}
                  onChange={(e) => setNewCampaign({ ...newCampaign, sender_email: e.target.value })}
                  placeholder="ceo@company.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Create Campaign</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Campaigns List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="card" style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: '10px' }}>{campaign.name}</h3>
            <div style={{ marginBottom: '15px' }}>
              <span className={`badge badge-${campaign.status === 'sent' ? 'success' : 'info'}`}>
                {campaign.status.toUpperCase()}
              </span>
            </div>

            {campaign.status === 'sent' && (
              <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Results:</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <div>📨 Sent: {campaign.total_sent}</div>
                  <div>👆 Clicked: {campaign.total_clicked} ({campaign.click_rate}%)</div>
                  <div>🚩 Reported: {campaign.total_reported}</div>
                </div>
              </div>
            )}

            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
              <strong>From:</strong> {campaign.sender_name} ({campaign.sender_email})<br />
              <strong>Subject:</strong> {campaign.email_subject}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {campaign.status === 'draft' && (
                <button
                  className="btn btn-success btn-small"
                  onClick={() => handleLaunchCampaign(campaign.id)}
                >
                  Launch Campaign
                </button>
              )}
              {campaign.status === 'sent' && (
                <button
                  className="btn btn-info btn-small"
                  onClick={() => fetchCampaignResults(campaign.id)}
                  style={{ background: '#0ca5eb', color: 'white' }}
                >
                  View Results
                </button>
              )}
              <button
                className="btn btn-secondary btn-small"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Results Modal */}
      {selectedCampaign && (
        <div className="modal show">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <span>Campaign Results: {selectedCampaign.name}</span>
              <button className="close-btn" onClick={() => setSelectedCampaign(null)}>×</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                    {selectedCampaign.total_sent}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Sent</div>
                </div>
                <div style={{ padding: '15px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59f00' }}>
                    {selectedCampaign.total_clicked}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Clicked ({selectedCampaign.click_rate}%)</div>
                </div>
                <div style={{ padding: '15px', background: '#dcfce7', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#51cf66' }}>
                    {selectedCampaign.total_reported}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Reported</div>
                </div>
              </div>
            </div>

            <h4 style={{ marginBottom: '15px' }}>Employee Results:</h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Clicked</th>
                    <th>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCampaign.results?.map((result) => (
                    <tr key={result.id}>
                      <td>{result.employee?.full_name} ({result.employee?.email})</td>
                      <td>
                        <span className={`badge badge-${result.clicked ? 'danger' : result.reported ? 'success' : 'info'}`}>
                          {result.clicked ? 'CLICKED' : result.reported ? 'REPORTED' : 'NO ACTION'}
                        </span>
                      </td>
                      <td>{result.clicked ? '✓' : '—'}</td>
                      <td>{result.reported ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedCampaign(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {campaigns.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999' }}>No campaigns yet. Click "Create Campaign" to get started.</p>
        </div>
      )}
    </div>
  );
}

export default PhishingSimulation;
