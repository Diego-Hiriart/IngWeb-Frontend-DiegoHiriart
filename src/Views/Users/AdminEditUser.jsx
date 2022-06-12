import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function AdminEditUser(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlDel = 'https://localhost:7017/api/users/';
    const urlGetUser = 'https://localhost:7017/api/users/full-match/';
    const urlGetProfile = 'https://localhost:7017/api/profiles/search/';
    const urlRoleControl = 'https://localhost:7017/api/profiles/role-control'
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAdminRole, setIsAdminRole] = useState(false);
    const [searchParam, setSearchParam] = useState(//"searchParam" object
        {
            email: ''//property
        }
    )   
    const [successGet, setSuccessGet] = useState(null);
    const [successDel, setSuccessDel] = useState(null);
    const [successUpdate, setSuccessUpdate] = useState(null);
    const [isNewSearch, setIsNewSearch] = useState(false);

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
    
    //Search for the user and its profile
    const getUser = () =>{
        setSuccessDel(null);
        setSuccessUpdate(null);
        setUser(null);
        setProfile(null);
        setIsNewSearch(true);//So that the components below re redner and the checkbox doesnt stay the way it was previously, surely there's a better way
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
        };
        fetch(urlGetUser+searchParam.email, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => {setUser(json); getProfile(json[0].userID)});
                setSuccessGet(true);
            }else if(res.status === 401){
                setIs401(true)
                setSuccessGet(false);
            }else if(res.status === 403){
                setIs403(true)
                setSuccessGet(false);
            }else{
                setSuccessGet(false);
            }
        })
    }

    const getProfile = async (id) =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
        };
        await fetch(urlGetProfile+id, requestOptions)
            .then(res => {
                if(res.ok){
                    res.json()
                    .then(json => setProfile(json))
                    .then(setSuccessGet(true))
                }else if(res.status === 401){
                    setIs401(true)
                    setSuccessGet(false);
                }else if(res.status === 403){
                    setIs403(true)
                    setSuccessGet(false);
                }else{
                    setSuccessGet(false);
                }
            })
    }

    //Function to send DELETE request
    const deleteUser = async () =>{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
        };
        await fetch(urlDel+user[0].userID, requestOptions)
            .then(res => {
                if(res.ok){               
                    setSuccessDel(true);
                }else{
                    setSuccessDel(false);
                }
            }) 
    }

    const updateRole = async (e) =>{
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
        };
        await fetch(urlRoleControl+"?id="+user[0].userID+"&isAdmin="+isAdminRole, requestOptions)
            .then(res => {
                if(res.ok){    
                    setSuccessUpdate(true);
                }else{
                    setSuccessUpdate(false);
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

    function getAdminRoleInput(evt){
        setIsAdminRole(evt.target.checked);
    }

    const inputStyle = {'margin':'2px'};

    let content =
        <div className="container">
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '70%'}}>
                <h1>Admin control for users</h1>
                <p>Input the ID of the user you want to delete</p>                  
            </div>
            <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                <input type="text" name="id" value={searchParam.email} onChange={getSearchInput} placeholder="user ID" style={inputStyle}></input> 
                <button onClick={getUser}>Search</button>             
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
                        <h1>Admin control for users</h1>
                        <p>Input the ID of the user you want to admistrate</p>                  
                    </div>
                    <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '40%'}}>
                        <input type="text" name="email" value={searchParam.email} onChange={getSearchInput} placeholder="user's email" style={inputStyle}></input>
                        <button onClick={getUser}>Search</button>           
                    </div>
                    {user != null && profile != null && !isNewSearch ? 
                        <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width: '10%'}}>
                            <button style={inputStyle} onClick={deleteUser}>Delete</button>
                            {successDel == true ?
                                <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                                <h5><b>User deleted</b></h5>
                                </div>
                                :
                                <h5><b>{successDel != null && "The user you want to delete was not found"}</b></h5>
                            }                              
                            <br/>
                            <form onSubmit={updateRole} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%', gap:"5px"}}>
                                <label>Is admin: </label>
                                <input type="checkbox" defaultChecked={profile[0].isAdmin} value={isAdminRole} onChange={getAdminRoleInput}/>
                                <button type="submit">Update role</button>                                  

                            </form>
                            {successUpdate == true ?
                                <div style={{display: 'flex', 'flexDirection':'column',  justifyContent:'normal', alignItems:'normal', width:'40%'}}>
                                <h5><b>Role updated</b></h5>
                                </div>
                                :
                                <h5><b>{successUpdate != null && "The profile you want to update was not found"}</b></h5>
                            }   
                        </div>                
                        : 
                        <>
                        {isNewSearch ?
                            setIsNewSearch(false)//so that it can render once the search is done
                            :
                            <h5><b>{successGet != null && "The user you want to edit was not found"}</b></h5>
                        }
                        </>
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

export default AdminEditUser;