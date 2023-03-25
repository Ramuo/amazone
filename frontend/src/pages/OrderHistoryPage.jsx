import {useContext, useReducer, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Store} from '../Store'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import  {getError} from '../utils';
import {Button} from 'react-bootstrap';


const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, orders: action.payload, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload }
        default:
            return {...state};
    }
}

function OrderHistoryPage() {
    //STATE:
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, orders}, dispatch ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const {data} = await axios.get(`/api/orders/mine`, {
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        }

        fetchData();

    }, [userInfo]);

    //FUNCTIONS/


    //RENDERED ELEMENTS/
    return (
    <div>
        <h1>Historique des commande</h1>
        {loading ? (
            <LoadingBox></LoadingBox>
        ): error ?(
            <MessageBox variant='danger'>{error}</MessageBox>
        ): (
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTALE</th>
                        <th>RÉGLÉ</th>
                        <th>LIVRÉ</th>
                        <th>EN COURS</th>
                    </tr>
                </thead>
                <tbody>
                   {orders.map((order) => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Non'}</td>
                        <td>
                            {order.delivered
                            ? order.deliveredAt.substring(0, 10)
                            : 'Non'}
                        </td>
                        <td>
                            <Button
                            type='button'
                            variant='light'
                            onClick={() => { 
                                navigate(`/order/${order._id}`);
                            }}
                            >
                                Détails
                            </Button>
                        </td>
                    </tr>
                   ))} 
                </tbody>
            </table>
        )}
    </div>
    )
}

export default OrderHistoryPage