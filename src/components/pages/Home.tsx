import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";

import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import { SearchForm } from "../forms/SearchForm";
import { useState } from "react";
import WorkTitle from "../../model/WorkTitle";

const workTitle: any = null;
const initialEmployee: Employee = {
    id: 0, name: '', workTitle, imageUrl: ''
};

const Home: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    const employees = useSelectorEmployees();

    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);

    async function submitFn(pattern: String): Promise<Employee[]> {
        const res: InputResult = { status: 'success', message: '' };
        try {
            if (pattern.length == 0) {
                console.log("0 length pattern");
                console.log("all employees amount" + employees.length);
                setFoundEmployees(employees);

                successMessage = `${employees.length} employees has been found`
            }
            else if (pattern.length > 1) {
                console.log(">0 length pattern");

                await employeesService.findEmployeesByPattern(pattern)
                    .then(res => {
                if (res.length > 0) {
                    // console.log("I received res > 2");
                    setFoundEmployees(res);
                } else {
                    setFoundEmployees(employees);
                }
                });
                
                successMessage = `${employees.length} employees has been found`
            }
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        console.log("found employees sent" + foundEmployees.length);

        return foundEmployees;
    }

    return <SearchForm submitFn={submitFn} />
}

export default Home; 