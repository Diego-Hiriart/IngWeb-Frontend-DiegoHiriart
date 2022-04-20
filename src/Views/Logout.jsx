import {React, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"

function Logout(){
    let navigate = useNavigate();
    const urlCheckLogin = 'https://localhost:7017/api/auth/checklogin'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    console.log(JSON.parse(localStorage.getItem("authToken")))

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

    const content =
    <div className="container">
        {isLoggedIn === true ?
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                {localStorage.removeItem("authToken")}
                <h5><br/><b>You have logged out</b></h5>
                <button onClick={() => {navigate("/login")}}>Log in</button>
            </div>
            :
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%', flexDirection:'column'}}>
                <h5><br/><b>You are not logged in</b></h5>
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

export default Logout;