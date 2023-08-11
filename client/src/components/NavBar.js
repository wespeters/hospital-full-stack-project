import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>Hospital Appointments</h1>
      </div>
      <div className="navbar-links">
        <Link to="/">Doctor/Admin Login</Link>
        <Link to="/patient-login">Patient Login</Link>
      </div>
    </div>
  );
};

export default NavBar;
