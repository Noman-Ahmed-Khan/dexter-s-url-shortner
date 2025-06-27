import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import Spinner from '../components/spinner';


const Profile = () => {
    return (
        <div className="profile-container">
            <h1>Profile Page</h1>
            <p>This is the profile page. You can add user-specific information here.</p>
        </div>
    );
};

export default Profile;
