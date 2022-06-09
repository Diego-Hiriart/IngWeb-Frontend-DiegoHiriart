import React from "react";
import {useNavigate} from "react-router-dom"

function AdminMenu(){
    let navigate = useNavigate();
    const spacedStyle = {'margin':'4px'};
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Administration</h1>
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <button onClick={() => {navigate("/admin/brands")}} style={spacedStyle}>Manage brands</button>
                <button onClick={() => {navigate("/admin/models")}} style={spacedStyle}>Manage models</button>
                <button onClick={() => {navigate("/admin/components")}} style={spacedStyle}>Manage components</button>
            </div>
        </div>
    );
}

export default AdminMenu;