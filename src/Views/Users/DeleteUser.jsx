import {React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteUser(){
    let navigate = useNavigate();
    const [is400, setIs400] = useState(false);
    const [is401, setIs401] = useState(false);
    const [is403, setIs403] = useState(false);
    const urlDel = 'https://localhost:7017/api/users/';
    const urlCheckLogin = 'https://localhost:7017/api/auth/checklogin'
    const urlCheckAdmin = 'https://localhost:7017/api/auth/checkadmin'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRole, setIsRole] = useState(false);
    const [searchParam, setSearchParam] = useState(//"searchParam" object
        {
            id: ''//property
        }
    )   
    const [successDel, setSuccessDel] = useState(null);

    //Check if the user is logged in as soon as this page is entered
    useEffect(() => {
        checklogin();
        checkRole();
    }, [isLoggedIn])  

    //Checks if the token currently stored is valid
    function checklogin(){
        console.log(JSON.parse(localStorage.getItem("authToken")))
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken"))},
        };
        fetch(urlCheckLogin, requestOptions)
            .then(res => {
                if(res.ok){//If not ok, token must be invalid
                    setIsLoggedIn(true);
                }else{
                    setIsLoggedIn(false);
                }
            });
    }

    //Checks if the token currently stored has a valid role
    function checkRole(){
        console.log(JSON.parse(localStorage.getItem("authToken")))
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken"))},
        };
        fetch(urlCheckAdmin, requestOptions)
            .then(res => {
                if(res.ok){//If not ok, token must be invalid
                    setIsRole(true);
                }else{
                    setIsRole(false);
                }
            });
    }

    //Function to send DELETE request
    function deltUser(){
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
        };
        fetch(urlDel+searchParam.id, requestOptions)
            .then(res => {
                if(res.ok){               
                    setSuccessDel(true);
                }else if(res.status === 400){
                    setSuccessDel(false);
                    setIs400(true)
                }else if(res.status === 401){
                    setSuccessDel(false);
                    setIs401(true);
                }else if(res.status === 403){
                    setSuccessDel(false);
                    setIs403(true);
                }
            }) 
    }

    function getSearchInput(evt){
        const value = evt.target.value //The value that input has
        setSearchParam({
            ...searchParam,//A single searchParam with many properties has to be spread (...searchParam), that is spread the existing searchParam into the new one, merging them
            [evt.target.name]: value//The name the input has (same as the property from state we want ot link it to) is the value of the input
        });
    }

    const inputStyle = {'margin':'2px'};

    let content =
        <div className="container">
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                <h1>Delete user</h1>
                <p>Input the ID of the user you want to delete</p>                  
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                <input type="text" name="id" value={searchParam.id} onChange={getSearchInput} placeholder="user ID" style={inputStyle}></input>              
            </div>       
        </div>

    if(!isLoggedIn){
        content =
            <div className="container">
                <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width: '70%'}}>
                    <h3><br/>You must be logged in to view this</h3>
                    <button onClick={() => {navigate("/login")}}>Log in</button>
                </div>
            </div>
    }else {
        if(!isRole){
            content =
                <div className="container">
                    <div style={{display: 'flex', flexDirection:'column',  justifyContent:'center', alignItems:'center', width: '70%'}}>
                        <h3><br/>You are not allowed to view this</h3>
                        <button onClick={() => {navigate("/users")}}>Return to menu</button>
                    </div>
                </div>
        }else if((!is401 && !is403) || is400){
            content =
                <div className="container">
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                        <h1>Delete user</h1>
                        <p>Input the ID of the user you want to delete</p>                  
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                        <input type="text" name="id" value={searchParam.id} onChange={getSearchInput} placeholder="user ID" style={inputStyle}></input>              
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '10%'}}>
                        <button style={inputStyle} onClick={deltUser}>Delete</button>
                        <br/>
                    </div>
                    {successDel === true ? 
                        <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                            <h5><b>User deleted</b></h5>                              
                        </div>                
                        : 
                            <h5><b>{successDel != null && "The user you want to delete was not found"}</b></h5>
                    }         
                </div>
        }
    }
    
    return(
        <div>
            {content}
        </div>
    )
}

export default DeleteUser;