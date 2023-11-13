import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";

import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import { SearchForm } from "../forms/SearchForm";
import { useState } from "react";

const Home: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    const employees = useSelectorEmployees();

    const [foundEmployees, setFoundEmployees] = useState<Employee[]>([]);

    //???????????????
    !employeesService.isConnectedToWebSocket() && employeesService.connectWebSocket();

    async function submitFn(pattern: String, page: number): Promise<InputResult> {
        const res: InputResult = { status: 'success', message: '' };
        try {
            if (pattern.length == 0) {
               
                
                setFoundEmployees(employees);
            }
            else if (pattern.length > 1) {
                console.log(">0 length pattern");
                console.log("page: " + page);
                await employeesService.findEmployeesByPattern(pattern, page)
                    .then(res => {
                        console.log(res);
                        if (res.length > 0) {
                            console.log("I received res > 2");
                            setFoundEmployees(res);
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
        console.log("found employees sent" + foundEmployees.length);
        return res;
    }

    return <SearchForm submitFn={submitFn} employees={foundEmployees} />
}

export default Home; 