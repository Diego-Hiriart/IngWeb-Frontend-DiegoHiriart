import {Fragment, React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function DeleteUser(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlDel = 'https://ingweb-back-hiriart.herokuapp.com/api/users/';
    const [searchParam, setSearchParam] = useState(//"searchParam" object
        {
            id: ''//property
        }
    )   
    const [successDel, setSuccessDel] = useState(null);

    //Check if the user is logged in as soon as this page is entered
    useEffect(() => {
        AuthCheck().then((status) => setResponse(status))
    }, [])

    //Check what to do with the response
    useEffect(() => {      
        if(response == 200){
            setIs401(false)
            setIs403(false)
        }else if(response == 401){
            setIs401(true)
            setIs403(true)
        }else if(response == 403){
            setIs401(false)
            setIs403(true)
        }
        console.log(response)
    }, [response])  

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
                }else{
                    setSuccessDel(false);
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

    if(is401){
        content =
            <div className="container">
                <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width: '70%'}}>
                    <h3><br/>You must be logged in to view this</h3>
                    <button onClick={() => {navigate("/login")}}>Log in</button>
                </div>
            </div>
    }else {
        if(is403){
            content =
                <div className="container">
                    <div style={{display: 'flex', flexDirection:'column',  justifyContent:'center', alignItems:'center', width: '70%'}}>
                        <h3><br/>You are not allowed to view this</h3>
                        <button onClick={() => {navigate("/users")}}>Return to menu</button>
                    </div>
                </div>
        }else if(!is401 && !is403){
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