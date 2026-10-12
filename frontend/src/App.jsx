import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import TrainingDashboard from './components/TrainingDashboard';
import PhishingSimulation from './components/PhishingSimulation';
import EmailSecurityScanner from './components/EmailSecurityScanner';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios default header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/training"
          element={isAuthenticated ? <TrainingDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/phishing"
          element={isAuthenticated ? <PhishingSimulation /> : <Navigate to="/login" />}
        />
        <Route
          path="/email-security"
          element={isAuthenticated ? <EmailSecurityScanner /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
