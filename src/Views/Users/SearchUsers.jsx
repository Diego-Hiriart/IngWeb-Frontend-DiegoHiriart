import {React, useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchUsers(){
    let navigate = useNavigate();
    const [is400, setIs400] = useState(false);
    const [is401, setIs401] = useState(false);
    const [is403, setIs403] = useState(false);
    const urlGet = 'https://localhost:7017/api/users/partial-match/'
    const urlCheckLogin = 'https://localhost:7017/api/auth/checklogin'
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState(null);//users is empty by default
    const [successGet, setSuccessGet] = useState(null);
    const [searchParam, setSearchParam] = useState(//"searchParam" object
        {
            email: ''//property
        }
    )

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

    //Function to send GET request
    function search(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
        };
        fetch(urlGet+searchParam.email, requestOptions)
            .then(res => {
                if(res.ok){
                    res.json()
                    .then(json => setUsers(json));
                    setSuccessGet(true);
                }else if(res.status === 400){
                    setSuccessGet(false);
                    setIs400(true)
                }else if(res.status === 401){
                    setSuccessGet(false);
                    setIs401(true)
                }else if(res.status === 403){
                    setSuccessGet(false);
                    setIs403(true)
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
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};

    let content =
        <div className="container">
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                <h1>Search users</h1>
                <p>Input the email you are searching for (supports partial match)</p>                  
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                {/*Input needs name to be the same as the property in stsearchParamate we want ot link it to, searchParam value makes it a controlled component, 
                onChange allows to get handle the value and get it every time the is a change*/}
                <input type="text" name="email" value={searchParam.email} onChange={getSearchInput} placeholder="email" style={inputStyle}></input>
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'10%'}}>
                <button style={inputStyle} onClick={search}>Search</button>
                <br/>                
            </div>
            <div style={{display: 'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <h5><b>{successGet === false ? "No users found with requested email" : "Search for a user by email"}</b></h5>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableStyle}>
                            <th style={tableStyle}>ID</th>
                            <th style={tableStyle}>Email</th>
                            <th style={tableStyle}>Username</th>
                        </tr>
                    </thead>
                        <tbody>
                        </tbody>                                                                       
                </table>               
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
        if((successGet  && !is401 && !is403) || is400){
            content =
                <div className="container">
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                        <h1>Search users</h1>
                        <p>Input the email you are searching for (supports partial match)</p>                  
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                        {/*Input needs name to be the same as the property in stsearchParamate we want ot link it to, searchParam value makes it a controlled component, 
                        onChange allows to get handle the value and get it every time the is a change*/}
                        <input type="text" name="email" value={searchParam.email} onChange={getSearchInput} placeholder="email" style={inputStyle}></input>
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'10%'}}>
                        <button style={inputStyle} onClick={search}>Search</button>
                        <br/>                
                    </div>
                    <div style={{display: 'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                        <h5><b>{successGet === false ? "No users found with requested email" : "Search for a user by email"}</b></h5>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableStyle}>
                                    <th style={tableStyle}>ID</th>
                                    <th style={tableStyle}>Email</th>
                                    <th style={tableStyle}>Username</th>
                                </tr>
                            </thead>
                            {/* the {coondition && stuff} shows stuff only if the condition is met*/}
                            {successGet === true && users && 
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.userID} style={tableStyle}>
                                            <td style={tableStyle}>{user.userID}</td>
                                            <td style={tableStyle}>{user.email}</td>
                                            <td style={tableStyle}>{user.username}</td>
                                        </tr>
                                    ))}
                                </tbody>                                           
                            }                            
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

export default SearchUsers;