import React from "react";
import {useNavigate} from "react-router-dom"

const Home = () => {
    let navigate = useNavigate();
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', width: '70vh'}}>
                <h1>Ingeniería Web - Diego Hiriart</h1>              
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70vh', gap:"5px"}}>
                <button onClick={() => {navigate("/users")}}>Users</button>
                <button onClick={() => {navigate("/brands-models")}}>Brands & Models</button>
                <button onClick={() => {navigate("/admin")}}>Administration</button>
            </div>
        </div>    
    );
}

export default Home;