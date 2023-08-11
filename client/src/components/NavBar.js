import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>Hospital Appointments</h1>
      </div>
      <div className="navbar-links">
        <button className='navbar-link' onClick={() => navigate('/')}>Home</button>
        <button className='navbar-link' onClick={() => navigate('/patient-login')}>Patient Login</button>
      </div>
    </div>
  );
};

export default NavBar;
