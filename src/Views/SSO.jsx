import React, { useEffect, useState } from 'react';

const SSO = () => {
  const SSOApiURL = `${process.env.REACT_APP_TRENDY_API}/api/dashboard/users`;
  const [currentUser, setCurrentuser] = useState();

  const callSSOEndpoint = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('trendyAuthToken')),
      },
    };
    const SSOResponse = await fetch(SSOApiURL, requestOptions);
    const SSOContent = await SSOResponse.json();
    setCurrentuser(JSON.stringify(SSOContent));
  };

  useEffect(() => {
    callSSOEndpoint();
  }, []);

  return (
    <div>
      <h3>Curent user: </h3>
      <p>{currentUser}</p>
    </div>
  );
};

export default SSO;
