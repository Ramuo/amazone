import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import { Store } from '../Store';

function ProtectedRoute({children}) {
    //STATE  
    const {state} = useContext(Store);
    const {userInfo} = state;



    //RENDERED ELEMENTS:
    return userInfo ? children: <Navigate to='/signin'/>
    
}

export default ProtectedRoute