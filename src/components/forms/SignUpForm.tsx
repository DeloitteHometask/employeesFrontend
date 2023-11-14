import React, { useState } from 'react';
import LoginData from '../../model/LoginData';
import InputResult from '../../model/InputResult';

type Props = {
  submitFn: (loginData: LoginData) => Promise<InputResult>
}

const SignUpForm: React.FC<Props> = ({ submitFn }) => {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username: string = data.get('username')! as string;
    const password: string = data.get('password')! as string;
    const result = await submitFn({ username, password });
    setMessage(result.message || "");
    setSeverity(result.status);
    setOpen(true);
  };

  return (
    <div style={{
      marginTop: "27vh", alignItems: "center", justifyContent: "center", display: "flex"
    }}>
      <div style={{ display: "flex", flexDirection: "column" }} className="signin-form" >
        <div style={{ textAlign: "center", width: "100%" }} className="sing-up-header">
          SIGN UP
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className='username-input'
              type="text"
              name="username"
              placeholder="Username"
              required
              minLength={5}
            />
          </div>
          <div className="form-row">
            <input
              className='password-input'
              type="password"
              name="password"
              placeholder="Password"
              required
              minLength={8}
            />
          </div>
          <div className="form-buttons">
            <button className='sing-up-button' type="submit">Sign Up</button>
          </div>
        </form>
      </div>

      {open && (
        <div className={`alert-container alert ${severity}`}>
          <div className="alert-message">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpForm;