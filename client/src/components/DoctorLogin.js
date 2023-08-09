import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function DoctorLogin (){
    const [user, setUser] = useState({});
    const [logins, setLogins] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loginMsg, setLoginMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/logins')
            .then(resp => resp.json())
            .then(setLogins)
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
                setLoginMsg(`Logged in! Welcome ${loginInfo.user}`)
                setErrorMsg(null)
            } else {
                setLoginMsg('Logged in!')
                setErrorMsg(null)
            }
        } else {
            setErrorMsg('Login Unsuccessful!')
            setLoginMsg(null)
        }
    }

    return (
        <div>
            {errorMsg && <div>{errorMsg}</div>}
            {loginMsg && <div>{loginMsg}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type = "text"
                    name = "username"
                    value={user.username}
                    onChange = {handleChange}
                    placeholder = "Username"
                    required
                />
                <input
                    type = "password"
                    name = "password"
                    value = {user.password}
                    onChange = {handleChange}
                    placeholder = "Password"
                    required
                />
                <input type = "submit" value = "Login"/>
            </form>
            <br/>
            <label>Not a Doctor or Admin?</label>
            <button id="patient-login" onClick={() => navigate('/patientlogin')}>Patient</button>
        </div>
    )
}

export default DoctorLogin;