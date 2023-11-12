import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export type RouteType = {
    to: string, label: string
}

const Navigator: React.FC<{ routes: RouteType[] }> = ({routes}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);
    
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname);
        if (index < 0) index = 0;
        navigate(routes[index].to);
        setValue(index);
    }, [routes]);

    return (
        <div style={{marginTop: "2vh"}}>
            <nav className="navigator" style={{backgroundColor: "black", color: "common.white"}}>
                {routes.map((route, index) => (
                    <Link 
                    className="navigator-item"
                        key={route.to} 
                        to={route.to} 
                        onClick={() => setValue(index)} 
                        style={{
                            fontWeight: value === index ? "bold" : "normal",
                            marginRight: "1vh",
                            color: "white"
                          }}
                        
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
            <div>
            <Outlet />
            </div>
        </div>
    );
}

export default Navigator;


// import { AppBar, Box, Tab, Tabs } from '@mui/material';
// import { ReactNode, useEffect, useState } from 'react';
// import { Link, NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom'
// export type RouteType = {
//     to: string, label: string
// }
// const Navigator: React.FC<{ routes: RouteType[] }> = ({routes}) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [value, setValue] = useState(0);
//     useEffect(() => {
//         let index = routes.findIndex(r => r.to === location.pathname);
//         if (index < 0) {
//             index = 0;
//         }
//         navigate(routes[index].to);
//         setValue(index);
//     }, [routes])
//     function onChangeFn(event: any, newValue: number) {
//         setValue(newValue);
//     }
//     function getTabs(): ReactNode {
//         return routes.map(r => <Tab component={NavLink} to={r.to} label={r.label} key={r.label}/>)
//     }
//     return <Box mt={10}>
//        <AppBar sx={{backgroundColor:"lightgray"}}> 
//             <Tabs value={value < routes.length ? value : 0} onChange={onChangeFn}>
//                 {getTabs()}
//             </Tabs>
//         </AppBar> 
//         <Outlet></Outlet>
//     </Box>
// }
// export default Navigator;