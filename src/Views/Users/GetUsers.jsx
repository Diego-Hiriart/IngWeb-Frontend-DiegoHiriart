import {React, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function GetUsers(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlGet = 'https://localhost:7017/api/users'
    const [isRole, setIsRole] = useState(false);
    const [successGet, setSuccessGet] = useState(null);
    const [users, setUsers] = useState(null);//Users is empty by default

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

    //Function to send GET request
    const getAll = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
        };
        fetch(urlGet, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setUsers(json));
                setSuccessGet(true);
            }else if(res.status === 400){
                setSuccessGet(false);
            }else if(res.status === 401){
                setSuccessGet(false);
                setIs401(true)
            }else if(res.status === 403){
                setSuccessGet(false);
                setIs403(true)
            }
        })
    }

    //Request only runs when url changes
    useEffect(() => {
        getAll();
    }, [urlGet])   

    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};

    let content = 
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Get users</h1>
                <p>Something went wrong</p>  
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
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
        }if((users && successGet && !is401 && !is403)){//If users array has content, there is authorization and the request is not forbidden (correct role)
            content =
                <div className="container">
                    <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                        <h1>Get users</h1>
                    </div>
                    <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableStyle}>
                                    <th style={tableStyle}>ID</th>
                                    <th style={tableStyle}>Email</th>
                                    <th style={tableStyle}>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((user) => (
                                        <tr key={user.userID} style={tableStyle}>
                                            <td style={tableStyle}>{user.userID}</td>
                                            <td style={tableStyle}>{user.email}</td>
                                            <td style={tableStyle}>{user.username}</td>
                                        </tr>
                                    ))
                                }                            
                            </tbody>
                        </table>
                    </div>
                </div>
        }
    }
    
    return(
        <div>
            {content}
        </div>
    )
}

export default GetUsers;