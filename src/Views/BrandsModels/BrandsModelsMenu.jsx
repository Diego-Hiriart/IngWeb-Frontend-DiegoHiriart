import React from "react";
import {useNavigate} from "react-router-dom"

function BrandsModelsMenu(){
    let navigate = useNavigate();
    const spacedStyle = {'margin':'4px'};
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Models and brands</h1>
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <button onClick={() => {navigate("/brands-models/model-search")}} style={spacedStyle}>Search for a model</button>
                <button onClick={() => {navigate("/brands-models/manage-brands")}} style={spacedStyle}>Manage brands</button>
                <button onClick={() => {navigate("/brands-models/manage-models")}} style={spacedStyle}>Manage models</button>
                <button onClick={() => {navigate("/brands-models/manage-components")}} style={spacedStyle}>Manage components</button>
            </div>
        </div>
    );
}

export default BrandsModelsMenu;