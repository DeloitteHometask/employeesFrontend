import React from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="close-button" onClick={onClose} style={{color:"grey"}}>
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;