import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJWT";
import EmployeesService from "../service/EmployeesService";
import EmployeesServiceRest from "../service/EmployeesServiceRest";
import WorkTitleService from "../service/WorkTitlesService";
import WorkTitlesServiceRest from "../service/WorkTitlesServiceRest";

export const authService: AuthService =
 new AuthServiceJwt('http://localhost:3500/users/login');

 export const employeesService: EmployeesService =
  new EmployeesServiceRest("http://localhost:3500/employees");

 export const workTitlesService: WorkTitleService =
 new WorkTitlesServiceRest("localhost:3500/workTitles");