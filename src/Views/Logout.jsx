import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCheck from '../Components/AuthCheck';
import { useAuth0 } from '@auth0/auth0-react';

function Logout() {
  let navigate = useNavigate();
  const logoutReturnURL = 'http://localhost:3000/account';
  const [response, setResponse] = useState(null);
  const [is401, setIs401] = useState(true);
  const { logout } = useAuth0();
  const { isAuthenticated } = useAuth0();
  console.log(JSON.parse(localStorage.getItem('hlAuthToken')));

  const logoutAll = () => {
    localStorage.removeItem('hlAuthToken');
    if (isAuthenticated) {
      logout({ returnTo: logoutReturnURL });
    }
  };

  //Check if the user is logged in as soon as this page is entered
  useEffect(() => {
    AuthCheck().then((status) => setResponse(status));
    logoutAll();
  }, []);

  //Check what to do with the response
  useEffect(() => {
    if (response == 200) {
      setIs401(false);
    } else if (response == 401) {
      setIs401(true);
    } else if (response == 403) {
      setIs401(false);
    }
    console.log(response);
  }, [response]);

  const content = (
    <div className='container'>
      {is401 === true ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '70%',
            flexDirection: 'column',
          }}
        >
          <h5>
            <br />
            <b>You have logged out</b>
          </h5>
          <button
            onClick={() => {
              navigate('/login');
            }}
          >
            Log in
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '70%',
            flexDirection: 'column',
          }}
        >
          <h5>
            <br />
            <b>You are not logged in</b>
          </h5>
          <button
            onClick={() => {
              navigate('/login');
            }}
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );

  return <div>{content}</div>;
}

export default Logout;
