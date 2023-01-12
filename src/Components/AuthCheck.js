import {React} from "react";

const AuthCheck = async () =>{
    const urlCheckLogin = `${process.env.REACT_APP_API_URL}/api/auth/check`
    console.log(`Tech Issue token: ${JSON.parse(localStorage.getItem("hlAuthToken"))}`)
    console.log(`Trendy cloth token: ${JSON.parse(localStorage.getItem("trendyAuthToken"))}`)
    const requestOptions = {
        method: 'POST',
        headers: { 'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
    };
    const response = await fetch(urlCheckLogin, requestOptions) 
    const status = response.status
    return status
}

export default AuthCheck;