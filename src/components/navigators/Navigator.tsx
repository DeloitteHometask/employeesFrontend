import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Navigator.css'

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