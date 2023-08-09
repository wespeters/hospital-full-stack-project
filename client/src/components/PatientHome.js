import React, { useState } from "react";

const PatientHome = () => {
  const [action, setAction] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctorId: "", date: "" });

  const fetchAppointments = () => {
    fetch("/appointments") 
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

  const handleChangeAppointment = (appointmentId, newDate) => {
    fetch(`/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate }),
    })
      .then(() => fetchAppointments());
  };

  const handleCreateAppointment = () => {
    fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointment),
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
      {action === "change" && <div>{appointments.map((appointment) => <p key={appointment.id}>{appointment.date} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"} <button onClick={() => handleChangeAppointment(appointment.id, "newDate")}>Change</button></p>)}</div>}
      {action === "create" && <div>
        <select name="doctorId" onChange={handleNewAppointmentChange}>
          {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.lastname}</option>)}
        </select>
        <input type="date" name="date" onChange={handleNewAppointmentChange} />
        <button onClick={handleCreateAppointment}>Submit</button>
      </div>}
    </div>
  );
};

export default PatientHome;
