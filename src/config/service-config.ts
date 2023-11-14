import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJWT";
import EmployeesService from "../service/EmployeesService";
import EmployeesServiceRest from "../service/EmployeesServiceRest";
import WorkTitleService from "../service/WorkTitlesService";
import WorkTitlesServiceRest from "../service/WorkTitlesServiceRest";

export const authService: AuthService =
    new AuthServiceJwt('http://localhost:3500/accounts');

export const employeesService: EmployeesService =
    new EmployeesServiceRest("localhost:3500");

export const workTitlesService: WorkTitleService =
    new WorkTitlesServiceRest("localhost:3500");