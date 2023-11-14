import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/slices/AuthSlice';
import { authService } from '../../config/service-config';

const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    
    return (
        <div style={{
            marginTop: "27vh", alignItems: "center", justifyContent: "center", display: "flex"
        }}>
        <button className='sing-in-button' 
        onClick={() => {
            dispatch(authActions.reset());
            authService.logout();
            }}>Sign out</button>
        </div>
    );
}
 
export default SignOut;