import { useState, useRef } from 'react';
import axios from 'axios';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    if (isLogin) {
      try {
        const response = await axios.post(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB5SPgVo4pmAk4yVeyaQSAU7jIum-sQ92w',
          {
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        const errorDetails = error.response.data.error;
        alert(errorDetails.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB5SPgVo4pmAk4yVeyaQSAU7jIum-sQ92w',
          {
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response);
      } catch (error) {
        const errorDetails = error.response.data.error;
        alert(errorDetails.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
