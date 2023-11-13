import React, { useState } from "react";
import Employee from "../../model/Employee";
import { useSelectorWorkTitles } from "../../hooks/hooks";
import InputResult from "../../model/InputResult";

type Props = {
    submitFn: (empl: Employee) => Promise<InputResult>,
    employeeForUpdate?: Employee
}
const initialEmployee: Employee = {
    name: '',
    workTitle: { workTitle: '' },
    imageUrl: ''
};

export const EmployeeForm: React.FC<Props> = ({ submitFn, employeeForUpdate }) => {
    const workTitles = useSelectorWorkTitles();
    const [employee, setEmployee] = useState<Employee>(employeeForUpdate || initialEmployee);
    const [errorMessage, setErrorMessage] = useState('');

    function handlerName(event: any) {
        const name = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.name = name;
        setEmployee(emplCopy);
    }

    function handlerImageUrl(event: any) {
        const imageUrl = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.imageUrl = imageUrl;
        setEmployee(emplCopy);
    }

    function handlerWorkTitle(event: any) {
        const selectedWorkTitle = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.workTitle = { workTitle: selectedWorkTitle };
        setEmployee(emplCopy);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res = await submitFn(employee);
        res.status == "success" && event.target.reset();
    }

    function onResetFn(event: any) {
        setEmployee(employeeForUpdate || initialEmployee);
    }

    return (
        <div className="employee-form-container" style={{ marginTop: "25vh", flexDirection: "column" }} >
            <div style={{ textAlign: "center", width: "100%" }} className="add-employee-header">
                    ADD NEW EMPLOYEE
                </div>
            <form className="employee-form" onSubmit={onSubmitFn} onReset={onResetFn}>
                <div className="form-row">
                    <div>
                        <select
                            className='employee-form-input'
                            id="select-worktitle"
                            value={employee.workTitle?.workTitle || ''}
                            onChange={handlerWorkTitle}
                        >
                            <option value=''>Work Title</option>
                            {workTitles.map((wt, index) => <option value={wt.workTitle} key={index}>{wt.workTitle}</option>)}
                        </select>
                    </div>
                    <div>
                        <input
                            placeholder="Employee name"
                            className='employee-form-input'
                            id="employee-name"
                            type="text"
                            required
                            onChange={handlerName}
                            value={employee.name}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Image URL"
                            className='employee-form-input'
                            id="employee-url"
                            type="url"
                            required
                            onChange={handlerImageUrl}
                            value={employee.imageUrl}
                        />
                    </div>
                </div>
                <div className="form-buttons">
                    
                        <button className="create-employee-button" type="submit">Submit</button>
                        <button className="create-employee-button" type="reset">Reset</button>
                    
                </div>
            </form>
        </div>
    );
}