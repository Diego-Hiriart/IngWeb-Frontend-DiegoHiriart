import {React} from "react";

const AuthCheck = async () =>{
    const urlCheckLogin = 'https://localhost:7017/api/auth/check'
    console.log(JSON.parse(localStorage.getItem("authToken")))
    const requestOptions = {
        method: 'POST',
        headers: { 'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken"))},
    };
    const response = await fetch(urlCheckLogin, requestOptions) 
    const status = response.status
    return status
}

export default AuthCheck;