import {React, useState } from "react";
import {User} from "../../Models/User.ts"

function CreateUser(){
    //There is no log in and authorization control for user creation, since people need to be able to create a user
    const urlPost = 'https://localhost:7017/api/users';
    const [user, setUser] = useState(new User());
    const [success, setSuccess] = useState(null);

    //Function to send POST request
    function create(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
            body: JSON.stringify(user)
        };
        console.log(JSON.stringify(user))
        fetch(urlPost, requestOptions)
            .then(res => {
                if(res.ok){
                    setSuccess(true)
                }else{
                    setSuccess(false)
                }
            });
    } 

    function getInput(evt){
        const value = evt.target.value //The value that input has
        setUser({
            ...user,//A single thing with many properties has to be spread (...user), that is spread the existing state into the new one, merging them
            [evt.target.name]: value//The name the input has (same as the property from state we want ot link it to) is the value of the input
        });
    }

    const inputStyle = {'margin':'2px'};

    const content =
        <div className="container">
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                <h1>Create user</h1>                                
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                {/*Input needs name to be the same as the property in state we want ot link it to, state value makes it a controlled component, 
                onChange allows to get handle the value and get it every time the is a change*/}
                <input type="text" name="Email" defaultValue='' value={user.Email} onChange={getInput} placeholder="email" style={inputStyle}></input>
                <input type="text" name="Username" defaultValue='' value={user.Username} onChange={getInput} placeholder="username" style={inputStyle}></input>
                <input type="password" name="Password" defaultValue='' value={user.Password} onChange={getInput} placeholder="password" style={inputStyle}></input>              
                <br/>                
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'10%'}}>              
                <button style={inputStyle} onClick={create}>Create</button>
                <br/>                
            </div>
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                {success != null &&
                    <h5>Result: <b>{success ? "User created" : "An error ocurred"}</b></h5>
                }     
            </div>
        </div>
    
    return(
        <div>
            {content}
        </div>
    )
}

export default CreateUser;