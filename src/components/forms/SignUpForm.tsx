import React, { useState } from 'react';
import LoginData from '../../model/LoginData';
import InputResult from '../../model/InputResult';

type Props = {
  submitFn: (loginData: LoginData) => Promise<InputResult>

}

const SignUpForm: React.FC<Props> = ({ submitFn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email: string = data.get('email')! as string;
    const password: string = data.get('password')! as string;
    const result = await submitFn({ email, password });
    setMessage(result.message || "");
    setSeverity(result.status);
    setOpen(true);
  };

  //   const handleInputChange = (event: React.FormEvent<HTMLFormElement>) => {
  //     const { name, value } = event.target;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   };

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
            className='email-input'
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
          // onChange={handleInputChange}
          />
          </div>
          <div className="form-row">
          <input
            className='password-input'
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
          // onChange={handleInputChange}
          />
          </div>
          <div className="form-buttons">
          <button className='sing-up-button' type="submit">Sign Up</button>
          </div>
        </form>
      </div>

      {open && (
                <div className={`alert ${severity}`}>
                    {message}
                </div>
            )}

      {/* <div className={`alert ${open ? 'show' : ''}`}>
        <div className={`alert-message ${severity}`}>{message}</div>
        <button className="close-alert" onClick={() => setOpen(false)}>
          &times;
        </button>
      </div> */}
    </div>
  );
}

export default SignUpForm;