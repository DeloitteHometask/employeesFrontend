import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";
export const AUTH_DATA_JWT = 'auth-data-jwt';

function getUserData(data: any): UserData {
    console.log(data);
    
    const jwt = data.accessToken;
    localStorage.setItem(AUTH_DATA_JWT,jwt);
    const jwtPayloadJSON = atob(jwt.split('.')[1]);
    const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
    return {email: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes("ADMIN")?"admin": "user"}

// return {email: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes("ADMIN")?"admin": "user"}


//структура

// {
//     "roles": [
//       "ADMIN"
//     ],
//     "exp": 1692181879,
//     "iat": 1692178279,
//     "sub": "admin"
//   }

  //берем проект
  //смотрим какой у него есть АПИ
  //здесь АПИ есть в фетчах в ИмплоиСервисРест

//если есть авторизация но нет ДжеДаблЮТи токена то тогда берем и бросаем исключение или сразу Респонс (не передаем бину который делает аутентификацию - ЮзерНеймПассвАутФильтр (перед которым мы поставили свой фильтр))
//если хотим отменить такую Аутентификация - есть авторизация и нет токена - в респонс 401 год и не делаем ДуФльтр
}

export default class AuthServiceJwt implements AuthService {
    constructor(private url: string){}
    
    async login(loginData: LoginData): Promise<UserData > {
        
        const serverLoginData: any ={};
        serverLoginData.username = loginData.email;
        serverLoginData.password = loginData.password
        
       const response = await fetch(this.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverLoginData)
       });

       const res = await response.json();
       console.log(res);

       
        return response.ok ? getUserData(res) : null;
    }
    async logout(): Promise<void> {
       localStorage.removeItem(AUTH_DATA_JWT);
    }
    
}