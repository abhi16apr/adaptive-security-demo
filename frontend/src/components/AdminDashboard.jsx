import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, empRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/employees`)
      ]);

      setStats(statsRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Admin Dashboard</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Employees</h3>
          <div className="value">{stats?.total_employees || 0}</div>
          <div className="label">Active employees in system</div>
        </div>

        <div className="stat-box">
          <h3>Training Completion</h3>
          <div className="value">{stats?.training_completion_rate || 0}%</div>
          <div className="label">{stats?.completed_trainings || 0} of {stats?.total_trainings || 0} trainings completed</div>
        </div>

        <div className="stat-box">
          <h3>Phishing Click Rate</h3>
          <div className="value">{stats?.phishing_click_rate || 0}%</div>
          <div className="label">{stats?.clicked_phishing || 0} employees clicked phishing</div>
        </div>

        <div className="stat-box">
          <h3>Email Threats</h3>
          <div className="value">{stats?.email_threats || 0}</div>
          <div className="label">Detected and remediated</div>
        </div>

        <div className="stat-box">
          <h3>High Risk Employees</h3>
          <div className="value">{stats?.high_risk_employees || 0}</div>
          <div className="label">Require additional training</div>
        </div>

        <div className="stat-box">
          <h3>Active Campaigns</h3>
          <div className="value">{stats?.active_campaigns || 0}</div>
          <div className="label">Ongoing phishing simulations</div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card">
        <div className="card-header">
          Employees Overview
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Risk Level</th>
              <th>Training Completed</th>
              <th>Phishing Clicked</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td><strong>{emp.full_name}</strong></td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <span className={`badge badge-${emp.risk_level === 'high' ? 'danger' : emp.risk_level === 'medium' ? 'warning' : 'success'}`}>
                    {emp.risk_level}
                  </span>
                </td>
                <td>{emp.training_completed}</td>
                <td>{emp.phishing_clicked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">Quick Actions</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">Create Training Module</button>
          <button className="btn btn-primary">Launch Phishing Campaign</button>
          <button className="btn btn-primary">Add Employee</button>
          <button className="btn btn-primary">View Email Threats</button>
          <button className="btn btn-secondary" onClick={fetchData}>Refresh Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
