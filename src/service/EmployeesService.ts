import { Observable } from "rxjs";
import Employee from "../model/Employee";

export default interface EmployeesService {

    addEmployee(empl: Employee): Promise<Employee>;
    getEmployees(): Observable<Employee[] | string>;
    findEmployeesByPattern(pattern: String, page: number, pageSize: number): Promise<Employee[]>;
}