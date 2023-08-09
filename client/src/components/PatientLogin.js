import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const PatientLogin = () => {
    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState({ firstname: "", lastname: "", dob: "" }); // Initialize with empty strings
    const [errorMsg, setErrorMsg] = useState(null);
    const [loginMsg, setLoginMsg] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
        fetch('/patients')
            .then(resp => resp.json())
            .then(setPatients)
    }, [])
  
    function onChange(e){
        setPatient({...patient, [e.target.name]: e.target.value})
    }
  
    function handleSubmit(e) {
        e.preventDefault();
        let flag = 0;
      
        const inputDobDate = new Date(patient.dob);
        const inputDob = `${String(inputDobDate.getUTCMonth() + 1).padStart(2, '0')}/${String(inputDobDate.getUTCDate()).padStart(2, '0')}/${inputDobDate.getUTCFullYear()}`;
      
        for (let i = 0; i < patients.length; i++) {
          console.log('Comparing:', patients[i].dob, 'with input:', inputDob);
      
          if (
            patients[i].dob === inputDob &&
            patients[i].firstname === patient.firstname &&
            patients[i].lastname === patient.lastname
          ) {
            flag = 1;
          }
        }
      
        if (flag === 1) {
          setLoginMsg('Logged in!');
          navigate('/patient-home');
        } else {
          setErrorMsg('Login unsuccessful');
        }
      }
      
  
    return (
        <div>
            {errorMsg && <div>{errorMsg}</div>}
            {loginMsg && <div>{loginMsg}</div>}
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
                    type="date"
                    name="dob"
                    value={patient.dob}
                    onChange={onChange}
                    placeholder="Date of Birth"
                    required
                />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
  };
  
  export default PatientLogin;
  
