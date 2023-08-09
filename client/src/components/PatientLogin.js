import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const PatientLogin = () => {
    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => fetch('/patients')
        .then(resp => resp.json())
        .then(setPatients), [])

    function onChange(e){
        setPatient({...patient, [e.target.name]: e.target.value})
    }

    function handleSubmit (e){
        e.preventDefault()

        for (let i = 0; i < patients.length; i++){
            if ((patients[i].dob === patient.dob) && (patients[i].firstname === patient.firstname) && (patients[i].lastname === patient.lastname)) {
                navigate('/patienthome')
            }
        }

        setErrorMsg('Login unsuccessful')
    }

    return (
        <div>
            {errorMsg && <div>{errorMsg}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    value={patient.firstname}
                    onChange={onChange}
                    placeholder="First name"
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    value={patient.lastname}
                    onChange={onChange}
                    placeholder="Last name"
                    required
                />
                <input
                    type="text"
                    name="dob"
                    value={patient.dob}
                    onChange={onChange}
                    required
                />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default PatientLogin;
