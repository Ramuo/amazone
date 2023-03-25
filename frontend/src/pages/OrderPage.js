
import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {Store} from '../Store'
import  LoadingBox from '../components/LoadingBox';
import  MessageBox from '../components/MessageBox';
import {getError} from '../utils';
import {toast} from 'react-toastify'
import {OrderReducer} from '../context/order/orderPageReducer';
import {
    Row,
    Col,
    Image,
    Card,
    ListGroup
} from 'react-bootstrap';



function OrderPage() {
    //STATE:
    //state from Store
    const {state} = useContext(Store);
    const {userInfo} = state;

    //state from orderReducer
    const [{loading, error, order, successPay, loadingPay}, dispatch] = useReducer(OrderReducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
    });


    const navigate = useNavigate();
    const params = useParams();
    const {id: orderId} = params;

    //State from PayPal reducer
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
    //functions to handle PayPalButtons
    //TO CREATE ORDER
    function createOrder(data, actions){
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {value: order.totalPrice},
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    }
    //TO APPROVE PAIMENT
    function onApprove(data, actions){
        return actions.order.capture().then(async function(details) {
            try {
                dispatch({type: 'PAY_REQUEST'});
                const {data} = await axios.put(`/api/orders/${order._id}/pay`,
                details,
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                });

                dispatch({type: 'PAY_SUCCESS', payload: data});
                toast.success('paiement réussi')

            } catch (error) {
                dispatch({type: 'PAY_FAIL', payload: getError(error)});
                toast.error(getError(error));
            }
        });

        
    }
    // TO HANDLE ERROR ON PAYMENT
    function onError(error){
        toast.error(getError(error))
    }


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/orders/${orderId}`,{
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (error) {
                dispatch({type: 'FETCH_FAIL', palyload: getError(error)});
            }
        }

        if(!userInfo){
            return navigate('/login');
        }

        if(!order._id || successPay || (order._id && order._id !== orderId )){
            fetchOrder();
            if(successPay){
                dispatch({type: 'PAY_RESET'});
            }
        }else{
            const loadPaypalScript = async () => {
                const {data: clientId} = await axios.get('/api/keys/paypal', {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'EUR'
                    },
                });
                paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
            }
            loadPaypalScript();
        }

    }, [order, userInfo, navigate, orderId, paypalDispatch, successPay ]);

    //FUNCTIONS:



    //RENDERED ELEMENTS:
    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
        <div>
            <h1>Commande: {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Livraison</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                <strong>Adresse: </strong> {order.shippingAddress.address},
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant="success">
                                Livré à {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Non Livré</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Paiment</Card.Title>
                            <Card.Text>
                                <strong>Mode:</strong> {order.paymentMethod}
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant="success">
                                Payé à {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Non réglé</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Article(s)</Card.Title>
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className='align-items-center'>
                                            <Col md={6}>
                                                <Image
                                                src={item.image}
                                                alt={item.name}
                                                className='img-fluid rounded img-thumbnail'
                                                />{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>
                                                <Col md={3}>{item.price}€</Col>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Récapitulatif</Card.Title>
                            <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Article(s)</Col>
                                    <Col>{order.itemsPrice.toFixed(2)}€</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Frais de livraison</Col>
                                    <Col>{order.shippingPrice.toFixed(2)}€</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Taxe</Col>
                                    <Col>{order.taxPrice.toFixed(2)}€</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <strong>Totale</strong>
                                    </Col>
                                    <Col>
                                        <strong>{order.totalPrice.toFixed(2)}€</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {isPending ? (
                                        <LoadingBox/>
                                    ) : (
                                        <div>
                                            <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                            >
                                            </PayPalButtons>
                                        </div>
                                    )}
                                    {loadingPay && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>
                            )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderPage



