import {React, useEffect, useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function EditUser(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(false);
    const urlPut = `${process.env.REACT_APP_API_URL}/api/users`;
    const urlGet = `${process.env.REACT_APP_API_URL}/api/users/full-match/`;
    const [user, setUser] = useState(null);
    let [userPut, setuserPut] = useState(null);
    const [searchParam, setSearchParam] = useState(//"searchParam" object
        {
            email: ''//property
        }
    )
    const [successGet, setSuccessGet] = useState(null);
    const [successPut, setSuccessPut] = useState(null);
    const searchInput = createRef();
    const emailInput = createRef();
    const passwordInput = createRef();
    const usernameInput = createRef();

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

    //Function to send GET request
    const search = async () =>{
        setSearchParam({email : searchInput.current.value})
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
        };     
        await fetch(urlGet+searchParam.email, requestOptions)
            .then(res => {
                if(res.ok){
                    res.json()
                    .then(json => setUser(json));
                    setSuccessGet(true);
                    setSuccessPut(null);//Reset so it doesnt show the old result message                             
                }else if(res.status === 400){
                    setSuccessGet(false)
                    setSuccessPut(null);//Reset so it doesnt show the old result message
                }else if(res.status === 401){
                    setSuccessGet(false);
                    setSuccessPut(null);//Reset so it doesnt show the old result message
                    setIs401(true)
                }else if(res.status === 403){
                    setSuccessGet(false);
                    setSuccessPut(null);
                }
            }
        )
    }

    //Function to send PUT request
    function edit(){  
        userPut = {
            UserID : user[0].userID,
            Email : emailInput.current.value,
            Password: passwordInput.current.value,
            Username : usernameInput.current.value
        };
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
            body: JSON.stringify(userPut)
        };
        fetch(urlPut, requestOptions)
            .then(res => {
                if(res.ok){
                    setSuccessPut(true);
                    setUser(null);//Reset
                    setuserPut(null);//Reset
                }else{
                    setSuccessPut(false)
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
                <h1>Edit user</h1>
                <p>Input the email you are searching for (full match only)</p>                  
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                <input type="text" name="email" ref={searchInput} value={searchParam.email} onChange={getSearchInput} placeholder="email" style={inputStyle}></input>              
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '10%'}}>
                <button style={inputStyle} onClick={search}>Search</button>
                <br/>
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
        if((successGet && !is401)){
            content =
                <div className="container">
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                        <h1>Edit user</h1>
                        <p>Input the email you are searching for (full match only)</p>                  
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                        <input type="text" name="email" ref={searchInput} value={searchParam.email} onChange={getSearchInput} placeholder="email" style={inputStyle}></input>              
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '10%'}}>
                        <button style={inputStyle} onClick={search}>Search</button>
                        <br/>
                    </div>
                        {successGet === true && user != null ?
                            <>
                            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                                {/*Input needs name to be the same as the property in searchParam we want ot link it to, searchParam value makes it a controlled component, 
                                onChange allows to get handle the value and get it every time the is a change*/} 
                                <input type="text" name="Email" ref={emailInput} defaultValue={user[0].email} value={user.Email} onChange={getInput} placeholder="email" style={inputStyle}></input>
                                <input type="text" name="Username" ref={usernameInput} defaultValue={user[0].username} value={user[0].Username} onChange={getInput} placeholder="username" style={inputStyle}></input>
                                <input type="password" name="Password" ref={passwordInput} value={user[0].Password} onChange={getInput} placeholder="password" style={inputStyle}></input>
                            </div> 
                            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'10%'}}>                       
                                <button style={inputStyle} onClick={edit}>Edit</button>
                                <br/>                
                            </div>           
                            </>
                        :   
                            <h5><b>{successGet != null && successGet === false ? "The user you want to edit was not found" : ""}</b></h5>                  
                        }                                        
                    <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                        {successPut != null &&
                            <h5>Result: 
                                <b>{successPut ? "Modifications successfull" : "An error ocurred"}</b>
                            </h5>
                        }     
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

export default EditUser;