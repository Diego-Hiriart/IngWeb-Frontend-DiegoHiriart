import React from "react";
import {useNavigate} from "react-router-dom"

function UsersMenu(){
    let navigate = useNavigate();
    const spacedStyle = {'margin':'4px'};
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Users CRUD operations</h1>
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <button onClick={() => {navigate("/users/get")}} style={spacedStyle}>Get all users</button>
                <button onClick={() => {navigate("/users/search")}} style={spacedStyle}>Search for a user</button>
                <button onClick={() => {navigate("/users/create")}} style={spacedStyle}>Create new user</button>
                <button onClick={() => {navigate("/users/edit")}} style={spacedStyle}>Edit user</button>
                <button onClick={() => {navigate("/users/delete")}} style={spacedStyle}>Delete user</button>
            </div>
        </div>
    );
}

export default UsersMenu;