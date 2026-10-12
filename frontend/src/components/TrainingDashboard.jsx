import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function TrainingDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [newTraining, setNewTraining] = useState({
    title: '',
    category: 'phishing',
    description: '',
    content: '',
    duration_minutes: 15,
    difficulty: 'beginner'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trainRes, empRes] = await Promise.all([
        axios.get(`${API_URL}/trainings`),
        axios.get(`${API_URL}/employees`)
      ]);
      setTrainings(trainRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError('Failed to load training data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/trainings`, newTraining);
      setTrainings([...trainings, response.data]);
      setShowCreateModal(false);
      setNewTraining({
        title: '',
        category: 'phishing',
        description: '',
        content: '',
        duration_minutes: 15,
        difficulty: 'beginner'
      });
    } catch (err) {
      setError('Failed to create training');
    }
  };

  const handleAssignTraining = async (trainingId, employeeId) => {
    try {
      await axios.post(`${API_URL}/employees/${employeeId}/trainings/${trainingId}/start`);
      alert('Training assigned to employee');
    } catch (err) {
      setError('Failed to assign training');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>Security Training</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Create New Training
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Create Training Modal */}
      <div className={`modal ${showCreateModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <span>Create New Training Module</span>
            <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
          </div>
          <form onSubmit={handleCreateTraining}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newTraining.title}
                onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newTraining.category}
                onChange={(e) => setNewTraining({ ...newTraining, category: e.target.value })}
              >
                <option value="phishing">Phishing Detection</option>
                <option value="deepfakes">Deepfakes & Voice Cloning</option>
                <option value="ai_threats">AI Threats</option>
                <option value="compliance">Compliance Training</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newTraining.description}
                onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={newTraining.content}
                onChange={(e) => setNewTraining({ ...newTraining, content: e.target.value })}
                rows="5"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={newTraining.duration_minutes}
                  onChange={(e) => setNewTraining({ ...newTraining, duration_minutes: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={newTraining.difficulty}
                  onChange={(e) => setNewTraining({ ...newTraining, difficulty: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Create Training</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Training Modules */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Available Training Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {trainings.map((training) => (
            <div key={training.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{training.title}</h3>
                  <span className={`badge badge-info`}>{training.category}</span>
                </div>
              </div>
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>{training.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '12px', color: '#999' }}>
                <span>⏱️ {training.duration_minutes} min</span>
                <span>📊 {training.difficulty}</span>
              </div>
              <button
                className="btn btn-primary btn-small"
                onClick={() => setSelectedTraining(training)}
              >
                Assign to Employees
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Training Modal */}
      {selectedTraining && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <span>Assign "{selectedTraining.title}" to Employees</span>
              <button className="close-btn" onClick={() => setSelectedTraining(null)}>×</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.full_name}</td>
                      <td>
                        <button
                          className="btn btn-success btn-small"
                          onClick={() => {
                            handleAssignTraining(selectedTraining.id, emp.id);
                            setSelectedTraining(null);
                          }}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {trainings.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999' }}>No training modules yet. Click "Create New Training" to get started.</p>
        </div>
      )}
    </div>
  );
}

export default TrainingDashboard;
