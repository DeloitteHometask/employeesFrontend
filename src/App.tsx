import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import { RouteType } from "./components/navigators/Navigator";
import UserData from "./model/UserData";
import AddEmployee from "./components/pages/AddEmployee";
import { StatusType } from "./model/StatusType";
import CodeType from "./model/CodeType";
import { useDispatch } from "react-redux";
import { authActions } from "./redux/slices/AuthSlice";
import { authService } from "./config/service-config";
import Home from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
const { always, authenticated, admin, noadmin, noauthenticated } = routesConfig;

type RouteTypeOrder = RouteType & { order?: number }

function getRoutes(userData: UserData): RouteType[] {
  const res: RouteTypeOrder[] = [];
  res.push(...always);
  if (userData) {
    res.push(...authenticated);
    if (userData.role == 'admin') {
      res.push(...admin)
    } else {
      res.push(...noadmin)
    }
  } else {
    res.push(...noauthenticated);
  }
  res.sort((r1, r2) => {
    let res = 0;
    if (r1.order && r2.order) {
      res = r1.order - r2.order;
    }
    return res
  });
  if (userData) {
    res[res.length - 1].label = userData.username;
  }
  return res
}

const App: React.FC = () => {
  const userData = useSelectorAuth();
  const code = useSelectorCode();
  const dispatch = useDispatch();
  // console.log("userData: ", userData);
  

  const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
  const routes = useMemo(() => getRoutes(userData), [userData]);

  function codeProcessing(): [string, StatusType] {
    const res: [string, StatusType] = [code.message, 'success'];
    switch (code.code) {
      case CodeType.OK: res[1] = 'success'; break;
      case CodeType.SERVER_ERROR: res[1] = 'error'; break;
      case CodeType.UNKNOWN: res[1] = 'error'; break;
      case CodeType.AUTH_ERROR: res[1] = 'error';
        dispatch(authActions.reset());
        authService.logout()
    }
    return res;
  }
 
  return <BrowserRouter>
  <div className="deloitte">
    <span className="deloitte-name">Deloitte</span>
    <span className="deloitte-point">.</span>
    </div>
    <Routes>
      <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
        <Route index path="" element={<Home />} />
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>

  </BrowserRouter>
}

export default App;