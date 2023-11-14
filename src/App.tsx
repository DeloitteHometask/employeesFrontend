import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { RouteType } from "./components/navigators/Navigator";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import AddEmployee from "./components/pages/AddEmployee";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import SignUp from "./components/pages/SignUp";
import routesConfig from './config/routes-config.json';
import UserData from "./model/UserData";
import { useSelectorAuth } from "./redux/store";
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
  const routes = useMemo(() => getRoutes(userData), [userData]);
 
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