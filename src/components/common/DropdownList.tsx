import React from "react";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const DropdownList: React.FC<Props> = ({ onClose, children }) => {
  return (
    <div className="dropdownList-overlay" onClick={onClose}>
      <div className="dropdownList-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default DropdownList;