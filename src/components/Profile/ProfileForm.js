import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import axios from 'axios';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const enteredNewPassword = newPasswordInputRef.current.value;
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`,
        {
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      authCtx.setToken(response.data.idToken);
      history.replace('/');
    } catch (error) {
      const errorDetails = error.response.data.error;
      alert(errorDetails.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          minLength='7'
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
