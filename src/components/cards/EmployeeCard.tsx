import React, { useState } from "react";
import Employee from "../../model/Employee";
import InputResult from "../../model/InputResult";
import { EmployeeForm } from "../forms/EmployeeForm";
import '../../styles/EmployeeCard.css'

type Props = {
    employee: Employee;
    updateFn?: (empl: Employee) => Promise<InputResult>,
    deleteFn?: (empl: Employee) => Promise<InputResult>,
}

const EmployeeCard: React.FC<Props> = ({ employee, updateFn, deleteFn }) => {
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);    

    return (
        <div className="employee-card" style={{ maxWidth: '345px', backgroundColor: '#FFFFFF' }}>
            <div className="card-action-area">
                <img
                    src={employee.imageUrl}
                    alt="Employee image"
                    height="140"
                    style={{ width: '100%' }}
                />
                <div className="card-content">
                    <div className="employee-name">
                        {employee.name}
                    </div>
                    <div className="employee-worktitle">
                        {employee.workTitle.workTitle}
                    </div>
                </div>
            </div>

            {(updateFn !== undefined && deleteFn !== undefined) && (
                <div className="card-actions">
                    <button className="update-button" onClick={() => setOpenUpdate(true)}>
                        Update employee
                    </button>
                    <button className="delete-button" onClick={() => deleteFn && deleteFn(employee)}>
                        Delete employee
                    </button>
                </div>
            )}

            {openUpdate && updateFn && (
                <EmployeeForm submitFn={updateFn} employeeForUpdate={employee} />
            )}
        </div>
    );
};

export default EmployeeCard;