import axios from 'axios';
import {useContext, useReducer, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderListReducer } from '../context/order/orderPageReducer';
import { Store } from '../Store';
import {toast} from 'react-toastify';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Button } from 'react-bootstrap';

function OrderListPage() {
    //STATE:
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, orders,loadingDelete, successDelete }, dispatch] = useReducer(OrderListReducer, {
        loading: true,
        error: '',
    });

    
   

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/orders`, {
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                });

                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                })
                
            }
        };

        if( successDelete){
          dispatch({type: 'DELETE_RESET'});
        }else{
          fetchData();
        }
    }, [userInfo, successDelete]);

    //FUNCTIONS:
    const deleteHandler = async (order) => {
      if(window.confirm('Êtes-vous sûr de supprimer ?')){
        try {
          dispatch({type: 'DELETE_REQUEST'});
          await axios.delete(`/api/orders/${order._id}`, {
            headers: {Authorization: `Bearer ${userInfo.token}`}
          });
          toast.success('Commande supprimée avec succès');
          dispatch({type: 'DELETE_SUCCESS'});
        } catch (err) {
          toast.error(getError(err));
          dispatch({
            type: 'DELETE_FAIL'
          })
          
        }
      }
    }

    //RENDERED ELEMENTS:
    return (
    <div>
        <h1>Commandes</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
            <LoadingBox></LoadingBox>
        ) : error ?(
            <MessageBox variant='danger'>{error}</MessageBox>
        ): (
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>UTILISATEUR</th>
                        <th>DATE</th>
                        <th>TOTALE</th>
                        <th>RÉGLÉ</th>
                        <th>LIVRÉ</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'UTILISATEUR SUPPRIMÉ'}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}€</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Non'}</td>

                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'Non'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="info"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="warning"
                    onClick={() => deleteHandler(order)}
                  >
                    Supprimé
                  </Button> 
                </td>
              </tr>
            ))}
                </tbody>
            </table>
        )}
    </div>
    );
}

export default OrderListPage