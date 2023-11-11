import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";

import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import { SearchForm } from "../forms/SearchForm";
import { useState } from "react";

const initialEmployee: Employee = {
    id: 0, name: '', workTitle: '', imageUrl: ''
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
                setFoundEmployees(employees);
                successMessage = `${employees.length} employees has been found`
            }
            else if (pattern.length > 1) {
                const employeesByPattern: Employee[] = await employeesService.findEmployeesByPattern(pattern);
                setFoundEmployees(employeesByPattern);
                successMessage = `${employees.length} employees has been found`
            }
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return foundEmployees;
    }

    return <SearchForm submitFn={submitFn} />
}

export default Home; 