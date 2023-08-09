import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientLogin from "./PatientLogin";
import DoctorLogin from "./DoctorLogin";

function App() {
  return (
    <Routes>
      <Route exact path="/" element = {<DoctorLogin />} />
      <Route path="/patientlogin" element={<PatientLogin />} />
    </Routes>
  );
}

export default App;
