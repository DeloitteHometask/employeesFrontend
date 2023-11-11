import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/slices/AuthSlice';

const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <button onClick={() => dispatch(authActions.reset())}>confirm sign out</button>
    );
}
 
export default SignOut;

// import {useDispatch} from 'react-redux';
// import { authActions } from '../../redux/slices/AuthSlice';
// import { Button } from '@mui/material';
// const SignOut: React.FC = () => {
//     const dispatch = useDispatch();
//     return <
//         Button onClick={() => dispatch(authActions.reset())}>confirm sign out</Button>
// }
 
//  export default SignOut;