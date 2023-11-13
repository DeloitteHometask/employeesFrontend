import * as React from 'react';
import InputResult from '../../model/InputResult';
import LoginData from '../../model/LoginData';
import { StatusType } from '../../model/StatusType';

type Props = {
    submitFn: (loginData: LoginData) => Promise<InputResult>
}

const SignInForm: React.FC<Props> = ({ submitFn }) => {
    const message = React.useRef<string>('');
    const [open, setOpen] = React.useState(false);
    const severity = React.useRef<StatusType>('success');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')! as string;
        const password: string = data.get('password')! as string;
        const result = await submitFn({ email, password });
        message.current = result.message!;
        severity.current = result.status;
        message.current && setOpen(true);
    };

    return ( 
        <div style={{
            marginTop: "27vh", alignItems: "center", justifyContent: "center", display: "flex"
        }}>
            <div style={{ flexDirection: "column"}} className="signin-form" >
                <div style={{ textAlign: "center", width: "100%" }} className="sing-in-header">
                    SIGN IN
                </div>
                <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <input
                        className='email-input'
                        required
                        // type=""
                        name="email"
                        placeholder="Email Address"
                    />
                    </div>
                   <div className="form-row">
                    <input
                        className='password-input'
                        required
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    </div>
                    <div className="form-buttons">
                    <button className='sing-in-button' type="submit">Sign In</button>

                    <button
                        className="create-account-button"
                        type="button"
                        onClick={() => {
                            window.location.href = "/signup";
                        }}
                        style={{marginLeft:"1vh"}}
                    >
                        Create new account
                    </button>
                    </div>
                </form>
            </div>
            {open && (
                <div className={`alert ${severity.current}`}>
                    {message.current}
                </div>
            )}
        </div>
    );
}

export default SignInForm;