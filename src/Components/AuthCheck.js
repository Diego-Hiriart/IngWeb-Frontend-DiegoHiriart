import {React} from "react";

const AuthCheck = async () =>{
    const urlCheckLogin = 'https://ingweb-back-hiriart.herokuapp.com/api/auth/check'
    console.log(JSON.parse(localStorage.getItem("hlAuthToken")))
    const requestOptions = {
        method: 'POST',
        headers: { 'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
    };
    const response = await fetch(urlCheckLogin, requestOptions) 
    const status = response.status
    return status
}

export default AuthCheck;