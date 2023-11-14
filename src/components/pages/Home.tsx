import { useState } from "react";
import { employeesService } from "../../config/service-config";
import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import Employee from "../../model/Employee";
import InputResult from "../../model/InputResult";
import '../../styles/EmployeesSearch.css';
import '../../styles/Modal.css';
import { SearchForm } from "../forms/SearchForm";

const Home: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    const employees = useSelectorEmployees();

    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);

    async function submitFn(pattern: String, page: number, pageSize: number): Promise<InputResult> {
        const res: InputResult = { status: 'success', message: '' };
        try {
            if (pattern.length == 0) {
                setFoundEmployees(employees);
            }
            else if (pattern.length > 1) {
                await employeesService.findEmployeesByPattern(pattern, page, pageSize)
                    .then(response => {
                        if (page == 1 && response.length > 0) {
                            setFoundEmployees(response);
                        } else if (page >1) {
                            const addData = [...foundEmployees, ...response];
                            setFoundEmployees(addData);
                        } else {
                            setFoundEmployees(employees);
                        }
                    });
                successMessage = `${foundEmployees.length} employees has been found`
            }
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }

    return <SearchForm submitFn={submitFn} employees={foundEmployees} />
}

export default Home; 