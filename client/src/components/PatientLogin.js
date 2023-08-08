import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientLogin = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dob, setDob] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/patientlogin', {
            firstname: firstname,
            lastname: lastname,
            dob: dob
        })
        .then(response => {
            console.log(response);
            navigate('/appointments');
        })
        .catch(error => {
            console.log(error);
            setErrorMsg('Login unsuccessful');
        });
    };

    return (
        <div>
            {errorMsg && <div>{errorMsg}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                    placeholder="First name"
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    placeholder="Last name"
                    required
                />
                <input
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default PatientLogin;
