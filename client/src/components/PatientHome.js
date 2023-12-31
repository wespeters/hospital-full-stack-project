import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { formatTime } from '../helpers.js';

const PatientHome = () => {
  const location = useLocation();
  const patientId = location.state ? location.state.patientId : null;
  const [action, setAction] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctor_id: "", date: "" });
  const [changeDate, setChangeDate] = useState("");
  const [changeTime, setChangeTime] = useState("");
  const today = new Date().toISOString().split('T')[0];
  
  const filterAppointments = (appointments) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const todayDate = new Date(today);
      return appointmentDate >= todayDate;
    });
  };

  const fetchAppointments = () => {
    fetch(`/appointments?patientId=${patientId}`)
      .then((resp) => resp.json())
      .then((data) => setAppointments(filterAppointments(data)));
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
    const [year, month, day] = changeDate.split('-');
    const convertedDate = `${month}/${day}/${year}`;

    let hour = changeTime.substring(0,2)
    let minute = changeTime.substring(3,5)
    let meridiem = changeTime.substring(6)

    if (meridiem === 'PM' && hour !== 12){
      hour = parseInt(hour) + 12
    }

    const convertedTime = `${hour}:${minute}`
  
    fetch(`/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: convertedDate, time: convertedTime }),
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
      body: JSON.stringify({ ...newAppointment, date: convertedDate, time: newAppointment.time, patient_id: patientId }),
    })
      .then(() => fetchAppointments());
  };  

  const handleNewAppointmentChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
        <div className="dark-mode-toggle-container">
          <DarkModeToggle />
        </div>
      <h2 className='home-title'>Patient Home Page</h2>
      <div>
        <p>View All Appointments: <button className='task-button' role='button' onClick={handleView}>View</button></p>
        <p>Cancel an Appointment: <button className='task-button' role='button' onClick={handleCancel}>Cancel</button></p>
        <p>Change an Appointment: <button className='task-button' role='button' onClick={handleChange}>Change</button></p>
        <p>Make An Appointment: <button className='task-button' role='button' onClick={handleCreate}>Create</button></p>
      </div>
      {action === "view" && <div>{appointments.map((appointment) => <p key={appointment.id}>{appointment.date} {formatTime(appointment.time)} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"}</p>)}</div>}
      {action === "cancel" && <div>{appointments.map((appointment) => <p key={appointment.id}>{appointment.date} {formatTime(appointment.time)} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"} <button className='task-buttonish' role='button' onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button></p>)}</div>}
      {action === "change" && <div>
        {appointments.map((appointment) => (
          <div key={appointment.id}>
            <p>{appointment.date} {formatTime(appointment.time)} with Dr. {appointment.doctor ? appointment.doctor.lastname : "Unknown"}</p>
            <input type="date" value={changeDate} onChange={(e) => setChangeDate(e.target.value)} />
            <input type="time" value={changeTime} onChange={(e) => setChangeTime(e.target.value)} />
            <button className='task-buttonish' role='button' onClick={() => handleChangeAppointment(appointment.id)}>Change</button>
          </div>
        ))}
      </div>}
      {action === "create" && <div>
  <label>Select Doctor: </label>
  <select className='create-input' name="doctor_id" onChange={handleNewAppointmentChange} value={newAppointment.doctor_id}>
    <option value="">Select Doctor</option>
    {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.lastname}</option>)}
  </select>
  <input className='create-input' type="date" name="date" onChange={handleNewAppointmentChange} min={today} />
  <input className='create-input' type="time" name="time" onChange={handleNewAppointmentChange} />
  <button className='task-button' role='button' onClick={handleCreateAppointment}>Submit</button>
</div>}
    </div>
  );
};

export default PatientHome;