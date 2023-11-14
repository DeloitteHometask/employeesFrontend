import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";
import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import { SearchForm } from "../forms/SearchForm";
import { useState } from "react";
import '../../styles/Modal.css'
import '../../styles/EmployeesSearch.css'

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
                console.log("page: " + page);
                await employeesService.findEmployeesByPattern(pattern, page, pageSize)
                    .then(response => {
                        console.log(response);
                        if (page == 1 && response.length > 0) {
                            setFoundEmployees(response);
                        } else if (page > 1) {
                            const addData = [...foundEmployees, ...response];
                            setFoundEmployees(addData);
                        } else {
                            console.log("I received res length == 0");
                            setFoundEmployees(employees);
                        }
                    });

                successMessage = `${foundEmployees.length} employees has been found`
            }
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        console.log("found employees sent" + foundEmployees.length);
        return res;
    }

    return <SearchForm submitFn={submitFn} employees={foundEmployees} />
}

export default Home; 