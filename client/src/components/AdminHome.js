import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function AdminHome (){
    return (
        <div>
            <h1>Admin Home Page</h1>
            <div>
                <p>View Doctors: <button>View</button></p>
                <p>Add Doctor: <button>Add</button></p>
                <p>Remove Doctor: <button>Remove</button></p>
                <p>View Patients: <button>View</button></p>
                <p>View Appointments: <button>View</button></p>
            </div>
        </div>
    )
}

export default AdminHome;