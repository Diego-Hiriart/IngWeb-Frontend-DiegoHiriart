import React from "react";
import {useNavigate} from "react-router-dom"

const Home = () => {
    let navigate = useNavigate();
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', width: '70vh'}}>
                <h1>Ingeniería Web - Diego Hiriart</h1>              
            </div>
            <div>
                <button onClick={() => {navigate("/users")}}>Users</button>
            </div>
        </div>    
    );
}

export default Home;