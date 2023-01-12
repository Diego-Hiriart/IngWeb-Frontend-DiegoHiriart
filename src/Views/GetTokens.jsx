import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const GetTokens = () => {
  const auth0TechIssueRepoTokenURL =
  `${process.env.REACT_APP_API_URL}/api/auth/auth0-login`;
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
    console.log(JSON.stringify(userDTO));
    await fetch(auth0TechIssueRepoTokenURL, requestOptions).then((res) => {
      if (res.ok) {
        res
          .text() //Get the responde text, it has the token
          .then((text) =>
            localStorage.setItem('hlAuthToken', JSON.stringify(text))
          ); //Save the token to local storage, its a browser thing
        console.log(localStorage.getItem('hlAuthToken'));
        setLogInSuccess(true);
      } else {
        res.text().then((text) => console.log(text.toString()));
        setLogInSuccess(false);
      }
    });
  };

  if (isLoading && logInSuccess === undefined) {
    return <div>Loading...</div>;
  }
};

export default GetTokens;
