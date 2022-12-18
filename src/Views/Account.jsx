import {React, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import AuthCheck from "../Components/AuthCheck";

function Account(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);

    //Check if the user is logged in as soon as this page is entered
    useEffect(() => {
        AuthCheck().then((status) => setResponse(status))
    }, [])

    //Check what to do with the response
    useEffect(() => {      
        if(response == 200){
            setIs401(false)
        }else if(response == 401){
            setIs401(true)
        }else if(response == 403){
            setIs401(false)
        }
        console.log(response)
    }, [response])  

    const content=       
        <div className="container">
            {is401 === false ? 
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