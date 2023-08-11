import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { formatTime } from '../helpers.js'

function DoctorHome (){
    const location = useLocation();
    const doctorID = location.state ? location.state.doctorID : null;
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        date: "",
        time: "",
        patient_firstname: "",
        patient_lastname: "",
        patient_dob: ""
    });
    const [changeDate, setChangeDate] = useState("");
    const [changeTime, setChangeTime] = useState("");
    const [action, setAction] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchAppointments();
    },[])

    return (
        <div className="container">
        <div className="dark-mode-toggle-container">
            <DarkModeToggle />
        </div>
            <h2 className='home-title'>Doctor Home Page</h2>
            <div>
                <p>View Upcoming Appointments: <button className='task-button' role='button' onClick={handleViewClick}>View</button></p>
                <p>Edit an Existing Appointment: <button className='task-button' role='button' onClick={handleEditClick}>Edit</button></p>
                <p>Create an Appointment: <button className='task-button' role='button' onClick={handleCreateClick}>Create</button></p>
                <p>Cancel an Appointment: <button className='task-button' role='button' onClick={handleCancelClick}>Cancel</button></p>
            </div>
            {errorMsg && 
                <div>
                    <p>{errorMsg}</p>
                </div>
            }
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
                    <input className='create-input' type="date" name="date" value={newAppointment.date} onChange={handleChange} placeholder="Date"/>
                    <input className='create-input' type="time" name="time" value={newAppointment.time} onChange={handleChange} placeholder="Time"/>
                    <br />
                    <input className='create-input' type="text" name="patient_firstname" value={newAppointment.patient_firstname} onChange={handleChange} placeholder="Patient's Firstname"/>
                    <br />
                    <input className='create-input' type="text" name="patient_lastname" value={newAppointment.patient_lastname} onChange={handleChange} placeholder="Patient's Lastname"/>
                    <br />
                    <input className='create-input' type="date" name="patient_dob" value={newAppointment.patient_dob} onChange={handleChange} placeholder="Patient's DOB"/>
                    <br />
                    <button className='task-button' role='button' onClick={handleSubmit}>Submit</button>
                </div>
            }
            {action === "edit" &&
                <div>
                    {appointments.map(appointment => (
                        <div key={appointment.id}>
                            <p>{appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}</p>
                            <input type="date" value={changeDate} onChange={e => setChangeDate(e.target.value)} />
                            <input type="time" value={changeTime} onChange={e => setChangeTime(e.target.value)} />
                            <button className='task-buttonish' role='button' onClick={() => handleChangeAppointment(appointment.id)}>Change</button>
                        </div>
                    ))}
                </div>
            }
            {action === "cancel" &&
                <div>
                    {appointments.map(appointment => (
                        <p key={appointment.id}>
                            {appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}
                            <button className='task-buttonish' role='button' onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
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
            .then(resp => {
                fetchAppointments();
                setAction('view')
            })
            .catch(setErrorMsg)
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

        if (meridiem === 'PM' && hour !== 12){
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
            .then(() => {
                fetchAppointments();
                setAction('view');
            })
            .catch(setErrorMsg)
    }

    function handleSubmit(){
        fetch('/patients')
            .then(resp => resp.json())
            .then(setPatients)

        const [dobyear, dobmonth, dobday] = newAppointment.patient_dob.split('-');
        const convertedDobDate = `${dobmonth}/${dobday}/${dobyear}`;

        const [year, month, day] = newAppointment.date.split('-');
        const convertedDate = `${month}/${day}/${year}`;

        let hour = newAppointment.time.substring(0,2)
        let minute = newAppointment.time.substring(3,5)
        let meridiem = newAppointment.time.substring(6)

        if (meridiem === 'PM' && hour !== 12){
        hour = parseInt(hour) + 12
        }

        const convertedTime = `${hour}:${minute}`

        let patient = patients.find(p => p.firstname === newAppointment.patient_firstname && p.lastname === newAppointment.patient_lastname && p.dob === convertedDobDate);

        if (!patient) {
            setErrorMsg('Patient not found. Please check the details and try again.');
            return;
        }

        for (let i=0; i < patients.length; i++){
            if ((patients[i].firstname === newAppointment.patient_firstname) && (patients[i].lastname === newAppointment.patient_lastname) && (patients[i].dob === convertedDobDate)){
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
                    dob: convertedDobDate,
                })
            })
                .catch(setErrorMsg)

            fetch('/patients')
                .then(resp => resp.json())
                .then(setPatients)
                .catch(setErrorMsg)

            for (let i=0; i < patients.length; i++){
                if ((patients[i].firstname === newAppointment.patient_firstname) && (patients[i].lastname === newAppointment.patient_lastname) && (patients[i].dob === convertedDobDate)){
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
                date: convertedDate,
                time: convertedTime,
                patient_id: patient.id,
                doctor_id: doctorID
            })
        })
            .then(() => {
                fetchAppointments();
                setAction('view');
            })
            .catch(setErrorMsg)
    }

    function filterAppointments(appointments){
        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            const todayDate = new Date(today);
            return appointmentDate >= todayDate;
        });
    };

    function fetchAppointments() {
        fetch('/appointments')
          .then((resp) => resp.json())
          .then((data) => {
            const filteredAppointments = data.filter(
              (appointment) => appointment.doctor.id === doctorID
            );
            setAppointments(filterAppointments(filteredAppointments));
          })
          .catch(setErrorMsg);
      }
      
}

export default DoctorHome;