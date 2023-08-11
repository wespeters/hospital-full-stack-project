import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { formatTime } from '../helpers.js';

function AdminHome (){
    const [appointments, setAppointments] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [patients, setPatients] = useState(null);

    const [action, setAction] = useState(null);
    const [newDoctor, setNewDoctor] = useState({});
    const [newPatient, setNewPatient] = useState({});
    const [newAppointment, setNewAppointment] = useState({});
    const [changeAppointment, setChangeAppointment] = useState({});

    useEffect(() => {
        fetchAppointments();
    }, [])

    useEffect(() => {
        fetchPatients();
    }, [])

    useEffect(() => {
        fetchDoctors();
    }, [])

    return (
        <div className="container">
            <div className="dark-mode-toggle-container">
                <DarkModeToggle />
            </div>
            <h1>Admin Home Page</h1>
            <div>
                <p>View Doctors: <button onClick={() => setAction('view_doctors')}>View</button></p>
                <p>Add Doctor: <button onClick={() => setAction('add_doctor')}>Add</button></p>
                <p>Remove Doctor: <button onClick={() => setAction('remove_doctor')}>Remove</button></p>
                <p>View Patients: <button onClick={() => setAction('view_patients')}>View</button></p>
                <p>Add Patient: <button onClick={() => setAction('add_patient')}>Add</button></p>
                <p>Remove Patient: <button onClick={() => setAction('remove_patient')}>Remove</button></p>
                <p>View Appointments: <button onClick={() => setAction('view_appointments')}>View</button></p>
                <p>Create an Appointment: <button onClick={() => setAction('add_appointment')}>Create</button></p>
                <p>Edit an Appointment: <button onClick={() => setAction('edit_appointment')}>Edit</button></p>
                <p>Cancel Appointment: <button onClick={() => setAction('remove_appointment')}>Cancel</button></p>
            </div>
            {
                action === 'view_doctors' && 
                    <div>
                        {doctors.map((doctor) => (
                            <p key={doctor.id}>
                                Dr. {doctor.lastname}
                            </p>
                        ))}
                    </div>
            }
            {
                action === 'add_doctor' && 
                    <div>
                        <label>Add a Doctor:</label>
                        <br />
                        <input type="text" name="lastname" value={newDoctor.lastname} onChange={handleDoctorChange} placeholder="Dr's Lastname" />
                        <br />
                        <input type="text" name="username" value={newDoctor.username} onChange={handleDoctorChange} placeholder="Dr's Login Username" />
                        <br />
                        <input type="password" name="password" value={newDoctor.password} onChange={handleDoctorChange} placeholder="Dr's Password" />
                        <br />
                        <button onClick={handleAddDoctor}>Add</button>
                    </div>
            }
            {
                action === 'remove_doctor' && 
                    <div>
                        {doctors.map((doctor) => (
                            <p key={doctor.id}>
                                Dr. {doctor.lastname} 
                                <button onClick={() => handleRemoveDoctor(doctor.id)}>Remove</button>
                            </p>
                        ))}
                    </div>
            }
            {
                action === 'view_patients' && 
                    <div>
                        {patients.map((patient) => (
                            <p key={patient.id}>
                                {patient.firstname} {patient.lastname} | DOB: {patient.dob}
                            </p>
                        ))}
                    </div>
            }
            {
                action === 'add_patient' && 
                    <div>
                        <label>Add a Patient:</label>
                        <br />
                        <input type="text" name="firstname" value={newPatient.firstname} onChange={handlePatientChange} placeholder="Firstname" />
                        <br />
                        <input type="text" name="lastname" value={newPatient.lastname} onChange={handlePatientChange} placeholder="Lastname" />
                        <br />
                        <input type="date" name="dob" value={newPatient.dob} onChange={handlePatientChange} placeholder="Date of Birth" />
                        <br />
                        <button onClick={handleAddPatient}>Add</button>
                    </div>
            }
            {
                action === 'remove_patient' && 
                    <div>
                        {patients.map((patient) => (
                            <p key={patient.id}>
                                {patient.firstname} {patient.lastname} | DOB: {patient.dob}
                                <button onClick={() => handleRemovePatient(patient.id)}>Remove</button>
                            </p>
                        ))}
                    </div>
            }
            {action === "view_appointments" && 
                <div>
                    {appointments.map((appointment) => (
                        <p key={appointment.id}>
                            {appointment.date} {formatTime(appointment.time)} with Dr. {appointment.doctor.lastname} for {appointment.patient.firstname} {appointment.patient.lastname}
                        </p>
                    ))}
                </div>
            }
            {
                action === 'add_appointment' && 
                    <div>
                        <label>Create an Appointment:</label>
                        <br />
                        <input type="date" name="date" value={newAppointment.date} onChange={handleAppChange} placeholder="Date"/>
                        <input type="time" name="time" value={newAppointment.time} onChange={handleAppChange} placeholder="Time"/>
                        <br />
                        <input type="text" name="patient_firstname" value={newAppointment.patient_firstname} onChange={handleAppChange} placeholder="Patient's Firstname"/>
                        <br />
                        <input type="text" name="patient_lastname" value={newAppointment.patient_lastname} onChange={handleAppChange} placeholder="Patient's Lastname"/>
                        <br />
                        <input type="text" name="patient_dob" value={newAppointment.patient_dob} onChange={handleAppChange} placeholder="Patient's DOB"/>
                        <br />
                        <input type="text" name="dr_lastname" value={newAppointment.dr_lastname} onChange={handleAppChange} placeholder="Dr's Lastname" />
                        <br />
                        <button onClick={handleAddAppointment}>Submit</button>
                    </div>
            }
            {action === 'edit_appointment' &&
                <div>
                    {appointments.map(appointment => (
                        <div key={appointment.id}>
                            <p>{appointment.date} {formatTime(appointment.time)} with {appointment.patient.firstname} {appointment.patient.lastname}</p>
                            <input type="date" name="date" value={changeAppointment.date} onChange={e => setChangeAppointment({...changeAppointment, [e.target.name]: e.target.value})} />
                            <input type="time" name="time" value={changeAppointment.time} onChange={e => setChangeAppointment({...changeAppointment, [e.target.name]: e.target.value})} />
                            <button onClick={() => handleChangeAppointment(appointment.id)}>Change</button>
                        </div>
                    ))}
                </div>
            }
            {
                action === 'remove_appointment' && 
                    <div>
                        {appointments.map(appointment => (
                            <p key={appointment.id}>
                                {appointment.date} {formatTime(appointment.time)} with Dr. {appointment.doctor.lastname} for {appointment.patient.firstname} {appointment.patient.lastname}
                                <button onClick={() => handleRemoveAppointment(appointment.id)}>Cancel</button>
                            </p>
                        ))}
                    </div>
            }
        </div>
    )

    function handleRemoveDoctor(id){
        fetch(`/doctors/${id}`, { method: 'DELETE'})
            .then(() => {
                fetchDoctors();
                setAction('view_doctors');
            })
    }

    function handleRemovePatient(id){
        fetch(`/patients/${id}`, { method: 'DELETE'})
            .then(() => {
                fetchPatients();
                setAction('view_patients');
            })
    }

    function handleRemoveAppointment(id){
        fetch(`/appointments/${id}`, { method: "DELETE" })
            .then(resp => resp.json())
            .then(resp => {
                fetchAppointments();
                setAction('view_appointments');
            })
    }

    function handleAddDoctor(){
        const char = newDoctor.lastname.charAt(0).toUpperCase();
        const astname = newDoctor.lastname.slice(1);
        const lastname = char + astname;

        let doctor = null;

        console.log(doctors)
        
        for (let i = 0; i < doctors.length; i++){
            if(doctors[i].lastname === lastname){
                doctor = doctors[i]
            }
        }

        if (doctor === null){
            fetch('/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lastname: lastname
                })
            })

            fetch('/logins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: newDoctor.username,
                    password: newDoctor.password
                })
            })
                .then(() => {
                    fetchDoctors();
                    setAction('view_doctors');
                })
        } 
    }

    function handleAddPatient(){
        let patient = null;
        const [year, month, day] = newPatient.dob.split('-');
        const convertedDate = `${month}/${day}/${year}`;

        for (let i = 0; i < patients.length; i++){
            if(patients[i].firstname === newPatient.firstname && patients[i].lastname === newPatient.lastname && patients[i].dob === newPatient.dob){
                patient = patients[i];
            }
        }

        if (patient === null){
            fetch('/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: newPatient.firstname,
                    lastname: newPatient.lastname,
                    dob: convertedDate
                })
            })
                .then(() => {
                    fetchPatients();
                    setAction('view_patients');
                })
        }
    }

    function handleAddAppointment(){
        const [year, month, day] = newAppointment.date.split('-');
        const convertedDate = `${month}/${day}/${year}`;

        let hour = newAppointment.time.substring(0,2)
        let minute = newAppointment.time.substring(3,5)
        let meridiem = newAppointment.time.substring(6)

        if (meridiem === 'PM' && hour !== 12){
        hour = parseInt(hour) + 12
        }

        const convertedTime = `${hour}:${minute}`

        let patient = null;
        let doctor = null;

        for (let i=0; i < patients.length; i++){
            if ((patients[i].firstname === newAppointment.patient_firstname) && (patients[i].lastname === newAppointment.patient_lastname) && (patients[i].dob === newAppointment.patient_dob)){
                patient = patients[i]
            }
        }

        for(let i =0; i < doctors.length; i++){
            if (doctors[i].lastname === newAppointment.dr_lastname){
                doctor = doctors[i]
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

            fetchPatients();

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
                date: convertedDate,
                time: convertedTime,
                patient_id: patient.id,
                doctor_id: doctor.id
            })
        })
            .then(() => {
                fetchAppointments();
                setAction('view_appointments')
            })
    }

    function handleChangeAppointment(id){
        const [year, month, day] = changeAppointment.date.split('-');
        const convertedDate = `${month}/${day}/${year}`;

        let hour = changeAppointment.time.substring(0,2)
        let minute = changeAppointment.time.substring(3,5)
        let meridiem = changeAppointment.time.substring(6)

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
                setAction('view_appointments');
            });
    }

    function handleDoctorChange(e){
        setNewDoctor({...newDoctor, [e.target.name]: e.target.value})
    }

    function handlePatientChange(e){
        setNewPatient({...newPatient, [e.target.name]: e.target.value})
    }   

    function handleAppChange(e){
        setNewAppointment({...newAppointment, [e.target.name]: e.target.value})
    }

    function fetchDoctors(){
        fetch('/doctors')
            .then(resp => resp.json())
            .then(setDoctors)
    }

    function fetchPatients(){
        fetch('/patients')
            .then(resp => resp.json())
            .then(setPatients)
    }

    function fetchAppointments(){
        fetch('/appointments')
            .then(resp => resp.json())
            .then(setAppointments)
    }
}

export default AdminHome;