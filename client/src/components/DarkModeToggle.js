import React, { useContext } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <div className="dark-mode-toggle">
      <span>{darkMode ? 'Light Mode' : 'Dark Mode'}: </span>
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default DarkModeToggle;
