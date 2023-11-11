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
    return {username: jwtPayloadObj.sub, role: jwtPayloadObj.roles.includes("ADMIN")?"admin": "user"}

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

// //	@NotEmpty
// //  @Pattern(regexp = ".{6,}", message = "Min length of username is 6 symbols")
// @Size(min=5, message="username must be not less than 5 letters")
// final String username;

// //	@NotEmpty
// //	@Pattern(regexp = ".{6,}", message = "Min length of password is 6 symbols")
// @Size(min=8, message="password must be not less than 8 letters")
// final String password;//файнал чтобы по ссылке нельзя было менять пароль

// LocalDateTime expDate;

// @NotEmpty
// //	(message = "Roles array must not be empty")
// final String[] roles;

    async registration(loginData: LoginData): Promise<UserData> {
        if (loginData.password.length < 6) {
            throw 'Password should be at least 6 characters';
        }
        const isUnique: boolean = await this.isEmailUnque(loginData.email);
        if (!isUnique) {
            throw 'User with this email already exists';
        }

        const serverLoginData: any ={};
        serverLoginData.username = loginData.email;
        serverLoginData.password = loginData.password
        serverLoginData.role = ["USER"]
        
       const response = await fetch(this.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverLoginData)
       });
       const res = await response.json();
        return response.ok ? getUserData(res) : null;
    }

     private async isEmailUnque(email: string): Promise<boolean> {
       const response = await fetch(this.url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
       });
       const res = await response.json();
    return res;
    }

    // async updateUser(contactsData: ContactsData): Promise<ContactsData> {
    //     if (!contactsData.email || !await exists(this.users, contactsData.email)) {
    //         throw 'not found';
    //     }
    //     const docRef = getDocRef(this.users, contactsData.email);
    //     try {
    //         await setDoc(docRef, contactsData)
    //     } catch (error: any) {
    //         const firestoreError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestoreError);
    //         throw errorMessage;
    //     }
    //     return contactsData;
    // }

    // async deleteUser(email: string): Promise<void> {
    //     const docRef = getDocRef(this.users, email);
    //     if (!await exists(this.users, email)) {
    //         throw 'user not found';
    //     }
    //     try {
    //         await deleteDoc(docRef);
    //     } catch (error: any) {
    //         const firestoreError: FirestoreError = error;
    //         const errorMessage = getErrorMessage(firestoreError);
    //         throw errorMessage;
    //     }
    // }
    
}