import {React, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"

function Account(){
    let navigate = useNavigate();
    const urlCheckLogin = 'https://localhost:7017/api/auth/checklogin'
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const content=       
        <div className="container">
            {isLoggedIn === true ? 
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                    <br/>
                    <h5><b>You are already logged in</b></h5>     
                    <button onClick={() => {navigate("/logout")}}>Log out</button>           
                </div>
                :
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                    <br/>
                    <h5><b>You have not logged in yet</b></h5>     
                    <button onClick={() => {navigate("/login")}}>Log in</button>           
                </div>
            }
        </div>

    return(
        <div>
            {content}
        </div>
    )
}

export default Account;