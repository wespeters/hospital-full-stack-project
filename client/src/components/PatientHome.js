import React, { useState } from "react";
import { useLocation } from 'react-router-dom';

const PatientHome = () => {
  const location = useLocation();
  const patientId = location.state ? location.state.patientId : null;
  const [action, setAction] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctor_id: "", date: "" });
  const [changeDate, setChangeDate] = useState(""); // Added state for change date

  const fetchAppointments = () => {
    fetch(`/appointments?patientId=${patientId}`) 
      .then((resp) => resp.json())
      .then(setAppointments);
  };

  const fetchDoctors = () => {
    fetch("/doctors") 
      .then((resp) => resp.json())
      .then(setDoctors);
  };

  const handleView = () => {
    fetchAppointments();
    setAction("view");
  };

  const handleCancel = () => {
    fetchAppointments();
    setAction("cancel");
  };

  const handleChange = () => {
    fetchAppointments();
    setAction("change");
  };

  const handleCreate = () => {
    fetchDoctors();
    setAction("create");
  };

  const handleCancelAppointment = (appointmentId) => {
    fetch(`/appointments/${appointmentId}`, { method: "DELETE" })
      .then(() => fetchAppointments());
  };

  const handleChangeAppointment = (appointmentId) => {
    // Convert the date from 'YYYY-MM-DD' to 'MM/DD/YYYY'
    const convertedDate = changeDate.split('-').reverse().join('/');

    fetch(`/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: convertedDate }),
    })
      .then(() => fetchAppointments());
  };

  const handleCreateAppointment = () => {
    // Convert the date from 'YYYY-MM-DD' to 'MM/DD/YYYY'
    const [year, month, day] = newAppointment.date.split('-');
    const convertedDate = `${month}/${day}/${year}`;
    
    fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAppointment, date: convertedDate }),
    })
      .then(() => fetchAppointments());
  };  

  const handleNewAppointmentChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Patient Home Page</h1>
      <div>
        <p>View Upcoming Appointments: <button onClick={handleView}>View</button></p>
        <p>Cancel an Appointment: <button onClick={handleCancel}>Cancel</button></p>
        <p>Change an Appointment: <button onClick={handleChange}>Change</button></p>
        <p>Make An Appointment: <button onClick={handleCreate}>Create</button></p>
      </div>
      {action === "view" && <div>{appointments.map((appointment) => <p key={appointment.id}>{appointment.date} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"}</p>)}</div>}
      {action === "cancel" && <div>{appointments.map((appointment) => <p key={appointment.id}>{appointment.date} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"} <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button></p>)}</div>}
      {action === "change" && <div>
        {appointments.map((appointment) => (
          <div key={appointment.id}>
            <p>{appointment.date} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"}</p>
            <input type="date" value={changeDate} onChange={(e) => setChangeDate(e.target.value)} />
            <button onClick={() => handleChangeAppointment(appointment.id)}>Change</button>
          </div>
        ))}
      </div>}
      {action === "create" && <div>
      <label>Select Doctor: </label>
        <select name="doctor_id" onChange={handleNewAppointmentChange}>
          {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.lastname}</option>)}
        </select>
        <input type="date" name="date" onChange={handleNewAppointmentChange} />
        <button onClick={handleCreateAppointment}>Submit</button>
      </div>}
    </div>
  );
};

export default PatientHome;
