import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span>🛡️ Adaptive Security</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/training" className={location.pathname === '/training' ? 'active' : ''}>
            Training
          </Link>
        </li>
        <li>
          <Link to="/phishing" className={location.pathname === '/phishing' ? 'active' : ''}>
            Phishing Simulations
          </Link>
        </li>
        <li>
          <Link to="/email-security" className={location.pathname === '/email-security' ? 'active' : ''}>
            Email Security
          </Link>
        </li>
      </ul>
      <div className="nav-user">
        <span>{user?.full_name || 'User'}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
