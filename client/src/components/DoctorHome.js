import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { formatTime } from '../helpers.js'

function DoctorHome (){
    const location = useLocation();
    const doctorID = location.state ? location.state.doctorID : null;
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [newAppointment, setNewAppointment] = useState({});
    const [changeDate, setChangeDate] = useState(null);
    const [changeTime, setChangeTime] = useState(null);
    const [action, setAction] = useState(null);

    useEffect(() => {
        fetchAppointments();
    },[])

    return (
        <div className="container">
        <div className="dark-mode-toggle-container">
            <DarkModeToggle />
        </div>x
            <h1>Doctor Home Page</h1>
            <div>
                <p>View Upcoming Appointments: <button onClick={handleViewClick}>View</button></p>
                <p>Edit an Existing Appointment: <button onClick={handleEditClick}>Edit</button></p>
                <p>Create an Appointment: <button onClick={handleCreateClick}>Create</button></p>
                <p>Cancel an Appointment: <button onClick={handleCancelClick}>Cancel</button></p>
            </div>
            {action === "view" && 
                <div>
                    {appointments.map((appointment) => (
                        <p key={appointment.id}>
                            {appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}
                        </p>
                    ))}
                </div>
            }
            {action === "create" && 
                <div>
                    <label>Create an Appointment:</label>
                    <br />
                    <input type="text" name="date" value={newAppointment.date} onChange={handleChange} placeholder="Date"/>
                    <br />
                    <input type="text" name="time" value={newAppointment.time} onChange={handleChange} placeholder="Time"/>
                    <br />
                    <input type="text" name="patient_firstname" value={newAppointment.patient_firstname} onChange={handleChange} placeholder="Patient's Firstname"/>
                    <br />
                    <input type="text" name="patient_lastname" value={newAppointment.patient_lastname} onChange={handleChange} placeholder="Patient's Lastname"/>
                    <br />
                    <input type="text" name="patient_dob" value={newAppointment.patient_dob} onChange={handleChange} placeholder="Patient's DOB"/>
                    <br />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            }
            {action === "edit" &&
                <div>
                    {appointments.map(appointment => (
                        <div key={appointment.id}>
                            <p>{appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}</p>
                            <input type="date" value={changeDate} onChange={e => setChangeDate(e.target.value)} />
                            <input type="time" value={changeTime} onChange={e => setChangeTime(e.target.value)} />
                            <button onClick={() => handleChangeAppointment(appointment.id)}>Change</button>
                        </div>
                    ))}
                </div>
            }
            {action === "cancel" &&
                <div>
                    {appointments.map(appointment => (
                        <p key={appointment.id}>
                            {appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}
                            <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                        </p>
                    ))}
                </div>
            }
        </div>
    )

    function handleViewClick(){
        setAction('view')
    }

    function handleCreateClick(){
        setAction('create')
    }

    function handleEditClick(){
        setAction('edit')
    }

    function handleCancelClick(){
        setAction('cancel')
    }

    function handleCancelAppointment(id){
        fetch(`/appointments/${id}`, { method: "DELETE" })
            .then(resp => resp.json())
            .then(resp => fetchAppointments())
    }

    function handleChange(e){
        setNewAppointment({...newAppointment, [e.target.name]: e.target.value})
    }

    function handleChangeAppointment(id){
        const [year, month, day] = changeDate.split('-');
        const convertedDate = `${month}/${day}/${year}`;

        let hour = changeTime.substring(0,2)
        let minute = changeTime.substring(3,5)
        let meridiem = changeTime.substring(6)

        if (meridiem === 'PM' && hour != 12){
            hour = parseInt(hour) + 12
        }

        const convertedTime = `${hour}:${minute}`

        fetch(`/appointments/${id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                date: convertedDate, 
                time: convertedTime 
            })
        })
        
        fetchAppointments();
    }

    function handleSubmit(){
        fetch('/patients')
            .then(resp => resp.json())
            .then(setPatients)

        let patient = null;

        for (let i=0; i < patients.length; i++){
            if ((patients[i].firstname === newAppointment.patient_firstname) && (patients[i].lastname === newAppointment.patient_lastname) && (patients[i].dob === newAppointment.patient_dob)){
                patient = patients[i]
            }
        }

        if (patient === null){
            fetch('/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: newAppointment.patient_firstname,
                    lastname: newAppointment.patient_lastname,
                    dob: newAppointment.patient_dob,
                })
            })

            fetch('/patients')
                .then(resp => resp.json())
                .then(setPatients)

            for (let i=0; i < patients.length; i++){
                if ((patients[i].firstname === newAppointment.patient_firstname) && (patients[i].lastname === newAppointment.patient_lastname) && (patients[i].dob === newAppointment.patient_dob)){
                    patient = patients[i]
                }
            }
        }

        fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: newAppointment.date,
                time: newAppointment.time,
                patient_id: patient.id,
                doctor_id: doctorID
            })
        })

        fetchAppointments();
    }

    function fetchAppointments(){
        fetch(`/appointments`)
            .then(resp => resp.json())
            .then(data => setAppointments(data.filter(appointment => appointment.doctor.id === doctorID)))
    }
}

export default DoctorHome;