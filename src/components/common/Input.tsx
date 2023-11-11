import { useRef, useState } from "react";
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";

type Props = {
    submitFn: (inputText: string) => InputResult;
    placeholder: string;
    buttonTitle?: string;
    type?: string
}
const Input: React.FC<Props> = ({ submitFn, placeholder, buttonTitle, type }) => {

    const inputElementRef = useRef<any>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    const status = useRef<StatusType>('success');

    function onClickFn() {
        const res = submitFn(inputElementRef.current!.value);
        status.current = res.status;
        if (res.status === "success") {
            inputElementRef.current!.value = ''
        }
        setMessage(res.message || '');
        res.message && setTimeout(() => setMessage(''), 5000);
    }

    function onChangeFn(event: any) {
        inputElementRef.current = event.target as any
        setDisabled(!event.target.value)
    }

    return (
        <div>
            <input
                type={type || 'text'}
                placeholder={placeholder}
                ref={inputElementRef}
                onChange={onChangeFn}
            />
            <button onClick={onClickFn} disabled={disabled}>{buttonTitle || 'GO'}</button>
            {message && <div className={`alert ${status.current}`}>{message}</div>}
        </div>
    );
}

export default Input;