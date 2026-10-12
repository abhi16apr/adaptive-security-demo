import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password');
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('Admin User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email, password }
        : { email, password, full_name: fullName };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      onLogin(response.data.access_token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
          <strong>Demo Credentials:</strong><br />
          Email: admin@company.com<br />
          Password: password
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
