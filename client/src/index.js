import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { DarkModeProvider } from './contexts/DarkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </Router>
);
