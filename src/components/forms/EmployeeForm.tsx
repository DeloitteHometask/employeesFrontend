import React, { useState } from "react";
import Employee from "../../model/Employee";
import { useSelectorWorkTitles } from "../../hooks/hooks";
import InputResult from "../../model/InputResult";

type Props = {
    submitFn: (empl: Employee) => Promise<InputResult>,
    employeeForUpdate?: Employee
}
const workTitle: any = null;

const initialEmployee: Employee = {
    id: 0, name: '', workTitle, imageUrl: ''
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
        const workTitle = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.workTitle = workTitle;
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
        <div style={{ marginTop: "25vh" }}>
            <form onSubmit={onSubmitFn} onReset={onResetFn}>
                <div>
                    <label htmlFor="select-worktitle">Work Title</label>
                    <select
                        id="select-worktitle"
                        value={employee.workTitle.workTitle}
                        onChange={handlerWorkTitle}
                    >
                        <option value=''>None</option>
                        {workTitles.map((wt, index) => <option value={wt.workTitle} key={index}>{wt.workTitle}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="employee-name">Employee name</label>
                    <input
                        id="employee-name"
                        type="text"
                        required
                        onChange={handlerName}
                        value={employee.name}
                    />
                </div>
                <div>
                    <label htmlFor="employee-url">Employee URL</label>
                    <input
                        id="employee-url"
                        type="url"
                        required
                        onChange={handlerImageUrl}
                        value={employee.imageUrl}
                    />
                </div>
                <div style={{ textAlign: "center", marginTop: "10vh" }}>
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
        </div>
    );
}