import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientLogin from "./PatientLogin";

function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<h1>Phase 4 Project Client</h1>} />
      <Route path="/patientlogin" element={<PatientLogin />} />
    </Routes>
  );
}

export default App;
