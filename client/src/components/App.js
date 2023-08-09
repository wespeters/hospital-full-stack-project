import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientLogin from "./PatientLogin";
import PatientHome from "./PatientHome";

function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<h1>Phase 4 Project Client</h1>} />
      <Route path="/patientlogin" element={<PatientLogin />} />
      <Route path="/patienthome" element={<PatientHome />} />
    </Routes>
  );
}

export default App;
