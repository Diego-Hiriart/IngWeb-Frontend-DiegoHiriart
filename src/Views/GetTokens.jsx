import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const GetTokens = () => {
  const auth0TechIssueRepoTokenURL = `${process.env.REACT_APP_API_URL}/api/auth/auth0-login`;
  const trendyClothTokenURL = `${process.env.REACT_APP_TRENDY_API}/api/auth0/checkAuth0`;
  const [userDTO, setUserDTO] = useState();
  const [logInSuccess, setLogInSuccess] = useState();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setUserDTO({
        userID: 0,
        email: `${user.nickname}@gmail.com`,
        username: user.name.replace(' ', ''),
        password: '',
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userDTO) {
      tryLoginAuth0();
    }
  }, [userDTO]);

  useEffect(() => {
    if (logInSuccess == false) {
      return (
        <div>
          <h1>Log in failed</h1>
          <button onClick={() => navigate('/login')}>
            Return to log in screen
          </button>
        </div>
      );
    } else if (logInSuccess === true && isAuthenticated === true) {
      navigate('/');
    }
  }, [logInSuccess, isAuthenticated]);

  const tryLoginAuth0 = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDTO),
    };
    const techIssueResponse = await fetch(auth0TechIssueRepoTokenURL, requestOptions);
    const techIssueContent = await techIssueResponse.text();
    if(techIssueResponse.ok){
      localStorage.setItem('hlAuthToken', JSON.stringify(techIssueContent))
      setLogInSuccess(true);
    }else{
      console.log(techIssueContent.toString());
      setLogInSuccess(false);
    }
    const trendyResponse = await fetch(trendyClothTokenURL, requestOptions);
    const trendyContent = await trendyResponse.json();
    if(trendyResponse.ok){
      localStorage.setItem('trendyAuthToken', JSON.stringify(trendyContent.token))
      setLogInSuccess(true);
    }else{
      console.log(trendyContent.toString());
      setLogInSuccess(false);
    }
  };

  if (isLoading && logInSuccess === undefined) {
    return <div>Loading...</div>;
  }
};

export default GetTokens;
