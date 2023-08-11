import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";
import PatientLogin from "./PatientLogin";
import DoctorLogin from "./DoctorLogin";
import DoctorHome from "./DoctorHome";
import AdminHome from "./AdminHome";
import PatientHome from "./PatientHome";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<DoctorLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/patient-home" element={<PatientHome />} />
      </Routes>
    </>
  );
}

export default App;
