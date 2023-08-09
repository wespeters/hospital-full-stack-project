import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function AdminHome (){
    return (
        <div>
            <h1>Admin Home Page</h1>
            <div>
                <label>View Doctors: </label>
                <button>View</button>
                <br/>

                <label>Add Doctor: </label>
                <button>Create</button>
                <br />

                <label>Remove Doctor: </label>
                <button>Cancel</button>
                <br />

                <label>View Patients: </label>
                <button>View</button>
                <br />

                <label>View Appointments: </label>
                <button>View</button>
            </div>
            <div id='action-container'></div>
        </div>
    )
}

export default AdminHome;