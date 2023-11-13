import { useDispatch } from "react-redux";
import InputResult from "../../model/InputResult";
import LoginData from "../../model/LoginData";
import { authService } from "../../config/service-config";
import UserData from "../../model/UserData";
import SignUpForm from "../forms/SignUpForm";
import { authActions } from "../../redux/slices/AuthSlice";

const SignUp: React.FC = () => {
    const dispatch = useDispatch();

    async function submitFn(lodinData: LoginData): Promise<InputResult> {
        let successMessage: string = '';
        let inputResult: InputResult = {
            status: 'error',
            message: "Server unavailable, repeat later on"
        }
        try {
            const user: UserData = await authService.registration(lodinData);
            successMessage = `user with username: ${user!.username} has been registered`;
            const res: UserData = await authService.login({ username: lodinData.username, password: lodinData.password });
            res && dispatch(authActions.set({ ...lodinData, role: res.role }));
            inputResult = {
                status: res ? 'success' : 'error',
                message: res ? '' : 'Incorrect Credentials'
            }

        } catch (error) {
        }
        return inputResult;
    }

    return (
        <>
            <SignUpForm submitFn={submitFn}
            />
        </>)
}

export default SignUp;