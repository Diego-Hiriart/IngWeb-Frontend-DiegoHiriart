import {React, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import {Credentials} from "../Models/Credentials.ts";

function Login(){
    let navigate = useNavigate();
    const urlLogin = 'https://localhost:7017/api/auth/login';
    const urlCheckLogin = 'https://localhost:7017/api/auth/checklogin'
    const [credentials, setCredentials] = useState(new Credentials());
    const inputStyle = {'margin':'4px'};
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInResult, setLogInResult] = useState("")
    const [success, setSuccess] = useState(null);

    //Check if the user is logged in as soon as this page is entered
    useEffect(() => {
        checklogin();
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

    function tryLogin(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        };
        console.log(JSON.stringify(credentials))
        fetch(urlLogin, requestOptions)
            .then(res => {
                if(res.ok){
                    res.text()//Get the responde text, it has the token
                    .then(text => localStorage.setItem("authToken", JSON.stringify(text)));//Save the token to local storage, its a browser thing
                    console.log(localStorage.getItem("authToken"))
                    setSuccess(true)
                }else{
                    res.text()
                    .then(text => setLogInResult(text.toString()))
                    .then(text => console.log(text.toString()))
                    setIsLoggedIn(false)
                    setSuccess(false)
                }
            });
    } 
    
    function getInput(evt){
        const value = evt.target.value //The value that input has
        setCredentials({
            ...credentials,//A single thing with many properties has to be spread (...user), that is spread the existing state into the new one, merging them
            [evt.target.name]: value//The name the input has (same as the property from state we want ot link it to) is the value of the input
        });
    }

    const content=       
        <div className="container">
            <h2>Log in to your account</h2>
            {isLoggedIn === false && success !== true &&
                <>
                <br/>
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                    <input type="text" name="UserEmail" defaultValue='' value={credentials.UserEmail} placeholder="username or email" onChange={getInput} style={inputStyle}></input>
                    <input type="password" name="Password" defaultValue='' value={credentials.Password} placeholder="password" onChange={getInput} style={inputStyle}></input>                    
                </div>
                <br/>
                <div style={{display: 'flex', flexDirection:'row',  justifyContent:"center", alignItems:'center', width: '70%'}}>
                    <button style={{margin:'8px'}} onClick={tryLogin}>Login</button>
                    {/*<button style={{margin:'8px'}}>Forgot Password?</button>*/}
                </div>
                {success === false &&
                    <h5><br/><b>Log in failed: {logInResult}</b></h5>
                }
                </>
            }
            {isLoggedIn === true &&
                <>
                <br/>
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                    <h5><br/><b>You are already logged in</b></h5>     
                    <button onClick={() => {navigate("/logout")}}>Log out</button>           
                </div>
                <br></br>
                </>
            }
            {success === true &&
                <h5><br/><b>Log in successful</b></h5>            
            }        
        </div>

    return(
        <div>
            {content}
        </div>
    )
}

export default Login;