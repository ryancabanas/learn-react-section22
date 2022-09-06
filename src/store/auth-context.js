import React, { useState, useEffect } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  setToken: (token) => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredData = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = parseInt(localStorage.getItem('expirationTime'));

  const remainingTime = calculateRemainingTime(storedExpirationTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const storedData = retrieveStoredData();
  let initialToken;

  if (storedData.token) {
    initialToken = storedData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const setTokenHandler = (token) => {
    setToken(token);
  };

  /* When getting stored data during page refresh, need to work with that data
    in useEffect and need it to be down here because setting logoutTimer calls
    upon previously defined logoutHandler function. */
  useEffect(() => {
    if (storedData) {
      logoutTimer = setTimeout(logoutHandler, storedData.remainingTime);
    }
  }, [storedData]);

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    setToken: setTokenHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
