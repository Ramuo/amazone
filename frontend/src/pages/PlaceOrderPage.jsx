
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  ListGroup
 }from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import {getError} from '../utils';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import {PlaceOrderReducer} from '../context/order/placeOrder';



function PlaceOrderPage() {
  //STATE
  const [{loading}, dispatch] = useReducer(PlaceOrderReducer, {
    loading: false, 
    
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  
  
  const navigate = useNavigate();

  

  // CALCULATE ITEMS (shippingprice, taxprice, totalprice)
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  //FUNCTIONS:
  const placeOrderHandler = async () => {
    try {
      // To create an order request
      dispatch({type: 'CREATE_REQUEST'});
      // create the order from backend
      const {data} = await axios.post(
        '/api/orders', 
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          },
        }
      );

      //To clear cart from store
      ctxDispatch({type: 'CART_CLEAR'});
      //then create order from placeOrderReducer
      dispatch({type: 'CREATE_SUCCESS'});
      //To remove items from localStorage
      localStorage.removeItem('cartItems');
      //Then redirect user to order details
      navigate(`/order/${data.order._id}`);

    } catch (error) {
      dispatch({
        type: 'CREATE_FAIL' });
        toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
     
      <h1 className="my-3">Votre votre panier</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Adresse de Livraison</Card.Title>
              <Card.Text>
                <strong>Nom:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Adresse: </strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{ ' '}
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Éditer</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Mode de Paiment</Card.Title>
              <Card.Text>
                <strong>{cart.paymentMethod}</strong> 
              </Card.Text>
              <Link to="/payment">Éditer</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Article(s)</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>{item.price}€</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Éditer</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Récapitulatif de la commande</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Article(s)</Col>
                    <Col>{cart.itemsPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Livraison</Col>
                    <Col>{cart.shippingPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxe</Col>
                    <Col>{cart.taxPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Totale</strong>
                    </Col>
                    <Col>
                      <strong>{cart.totalPrice.toFixed(2)}€</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Passer la commande
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>} 
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderPage;