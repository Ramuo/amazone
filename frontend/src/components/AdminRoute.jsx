import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import { Store } from '../Store';

function AdminRoute({children}) {
    //STATE  
    const {state} = useContext(Store);
    const {userInfo} = state;



    //RENDERED ELEMENTS:
    return userInfo && userInfo.isAdmin ? children: <Navigate to='/signin'/>
    
}

export default AdminRoute