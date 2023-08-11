import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

function DoctorLogin (){
    const [user, setUser] = useState({ username: "", password: "" });
    const [logins, setLogins] = useState([]);
    const [doctors, setDoctors] = useState(null);

    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/logins')
            .then(resp => resp.json())
            .then(setLogins)

        fetch('/doctors')
            .then(resp => resp.json())
            .then(setDoctors)
    }, [])

    function handleChange(e){
        setUser({...user, [e.target.name]: e.target.value})
    }

    function handleSubmit(e){
        e.preventDefault()
        let flag = 0
        let loginInfo = null

        for (let i = 0; i < logins.length; i++){
            if ((logins[i].username === user.username) && (logins[i].password === user.password)){
                flag = 1
                loginInfo = logins[i]
            }
        }

        if (flag === 1){
            if(loginInfo.user_type === 'Doctor'){
                const doctor = doctors.find(doctor => loginInfo.user.includes(doctor.lastname))
                navigate('/doctor-home', { state: {doctorID: doctor.id}})
            } else {
                navigate('/admin-home')
            }
        } else {
            setErrorMsg('Login Unsuccessful!')
        }
    }

    return (
        <div className="container">
            <div className="dark-mode-toggle-container">
                <DarkModeToggle />
            </div>
            {errorMsg && <div>{errorMsg}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    className = "main-login-input"
                    type = "text"
                    name = "username"
                    value={user.username}
                    onChange = {handleChange}
                    placeholder = "Username"
                    required
                />
                <input
                    className = "main-login-input"
                    type = "password"
                    name = "password"
                    value = {user.password}
                    onChange = {handleChange}
                    placeholder = "Password"
                    required
                />
                <input className="button-29ish" role="button" type = "submit" value = "Login"/>
            </form>
            <br/>
            <label>Not a Doctor or Admin?</label>
            <button className="button-29" role="button" onClick={() => navigate('/patient-login')}>Patient</button>
        </div>
    )
}

export default DoctorLogin;