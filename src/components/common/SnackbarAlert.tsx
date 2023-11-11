import React, { useEffect, useRef, useState } from "react";
import { StatusType } from "../../model/StatusType";

type Props = {
    message: string;
    duration?: number;
    severity: StatusType;
}
const SnackbarAlert: React.FC<Props> = ({ message, duration, severity }) => {
    const [open, setOpen] = useState(false);
    const alertMessage = useRef('');

    useEffect(() => {
        message && setOpen(true);
        alertMessage.current = message;
    }, [message]);

    return open ? (
        <div className={`snackbar ${severity}`}>
            {message}
            <button onClick={() => setOpen(false)}>Close</button>
        </div>
    ) : null;
}

export default SnackbarAlert;