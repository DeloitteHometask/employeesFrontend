import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJWT";
import EmployeesService from "../service/EmployeesService";
import EmployeesServiceRest from "../service/EmployeesServiceRest";
import WorkTitleService from "../service/WorkTitlesService";
import WorkTitlesServiceRest from "../service/WorkTitlesServiceRest";

export const authService: AuthService =
    new AuthServiceJwt('https://employees-hometask-backend.fly.dev/accounts');

export const employeesService: EmployeesService =
    new EmployeesServiceRest("employees-hometask-backend.fly.dev");

export const workTitlesService: WorkTitleService =
    new WorkTitlesServiceRest("employees-hometask-backend.fly.dev");