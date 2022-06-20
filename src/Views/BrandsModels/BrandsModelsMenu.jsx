import React from "react";
import {useNavigate} from "react-router-dom"

function BrandsModelsMenu(){
    let navigate = useNavigate();
    const spacedStyle = {'margin':'4px'};
    return(
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Brands & Models</h1>
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <button onClick={() => {navigate("/brands-models/model-search")}} style={spacedStyle}>Search for a model</button>
                <button onClick={() => {navigate("/brands-models/advanced-search")}} style={spacedStyle}>Advanced search</button>
                <button onClick={() => {navigate("/brands-models/create-post")}} style={spacedStyle}>Create post</button>
                <button onClick={() => {navigate("/brands-models/manage-posts")}} style={spacedStyle}>Manage your posts</button>                
            </div>
        </div>
    );
}

export default BrandsModelsMenu;