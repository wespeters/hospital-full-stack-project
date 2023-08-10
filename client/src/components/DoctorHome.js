import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

function DoctorHome (){
    return (
        <div>
            <DarkModeToggle />
            <h1>Doctor Home Page</h1>
            <div>
                <label>View Upcoming Appointments: </label>
                <button>View</button>
                <br/>

                <label>Create an Appointment: </label>
                <button>Create</button>
                <br />

                <label>Cancel an Appointment: </label>
                <button>Cancel</button>
            </div>
            <div id='action-container'></div>
        </div>
    )
}

export default DoctorHome;