import React from 'react';

type Props = {
    title: string;
    content: string;
    confirmFn: (isOk: boolean) => void;
    open: boolean
}
export const Confirmation: React.FC<Props> = ({ title, confirmFn, content, open }) => {
    const handleClose = (isOk: boolean) => {
        confirmFn(isOk);
    };

    return open ? (
        <div className="dialog">
            <div className="dialog-title">{title}</div>
            <div className="dialog-content">{content}</div>
            <div className="dialog-actions">
                <button onClick={() => handleClose(false)}>Cancel</button>
                <button onClick={() => handleClose(true)}>OK</button>
            </div>
        </div>
    ) : null;
}