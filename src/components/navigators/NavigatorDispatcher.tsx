import React from 'react';
import Navigator from "./Navigator";
import { RouteType } from "./Navigator";

const NavigatorDispatcher: React.FC<{ routes: RouteType[] }> = ({ routes }) => {
    return <Navigator routes={routes} />
}

export default NavigatorDispatcher;