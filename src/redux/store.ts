import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import CodePayload from "../model/CodePayload";
import UserData from "../model/UserData";
import { authReducer } from "./slices/AuthSlice";
import { codeReducer } from "./slices/codeSlice";

export const store = configureStore({
    reducer: {
     authState: authReducer,
     codeState: codeReducer
    }
});

export function useSelectorAuth() {
    return useSelector<any, UserData>(state => state.authState.userData);
}
export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage);
}


