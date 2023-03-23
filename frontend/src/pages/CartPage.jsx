import {useContext} from 'react';
import { Store } from '../Store';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Row,
    Col,
    ListGroup, 
    Image,
    Button,
    Card,
} from 'react-bootstrap';
import MessageBox from '../components/MessageBox';





function CartPage() {
    //STATE
    const {state, dispatch: ctxDispatch} = useContext(Store);

    //From state deconstruct cart then cartItems to list cartItems on the CartPage
    const {
        cart: { cartItems },
    } =state;

    const navigate = useNavigate();

    //FUNCTIONS:
    //TO increase or decrease item in cart
    const updateCartHandler = async (item, quantity) => {
        const {data} = await axios.get(`/api/products/${item._id}`);

        if(data.countInStock < quantity){
            window.alert('Désolé, le produit est en rupture de stock!');
            return; 
        }
      
        ctxDispatch({
            type: 'CART_ADD_ITEM', 
            payload: {...item, quantity},
        });
    }

    //To remove item in cart
    const removeItemHandler = (item) => {
        ctxDispatch({
            type: 'CART_REMOVE_ITEM', 
            payload: item
        });
    }

    //To redirect checkout (passer la commande)
    const checkOutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }


    //RENDERED ELEMENTS/
    return (
    <div>
        <h1> Panier</h1>
        <Row>
            <Col md={8}>
                { cartItems.length === 0 ? (
                    <MessageBox>
                        Votre panier est vide <Link to='/'>Retour</Link>
                    </MessageBox> 
                    ) :
                    (
                     <ListGroup>
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row className='align-items-center'>
                                    <Col md={4}>
                                        <Image 
                                        src={item.image}
                                        alt={item.name}
                                        className='img-fluid rounded img-thumbnail'
                                        />{ ' '}
                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={3}>
                                       <Button 
                                       variant='light'
                                       onClick={() => updateCartHandler(item, item.quantity - 1)}  
                                       disabled={item.quantity === 1}
                                       >
                                            <i className='fas fa-minus-circle'></i>
                                        </Button>{' '} 
                                        <span>{item.quantity}</span>{' '}
                                        <Button 
                                        variant='light'
                                        onClick={() => updateCartHandler(item, item.quantity + 1)} 
                                        disabled={item.quantity === item.countInStock}
                                        >
                                            <i className='fas fa-plus-circle'></i>
                                        </Button>
                                    </Col>
                                    <Col md={3}>{item.price}€</Col>
                                    <Col md={2}>
                                        <Button 
                                        variant='light'
                                        onClick={() => removeItemHandler(item)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                     </ListGroup>   
                    )  
                }
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                            <h3>
                                Total {cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                Article(s): {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}€
                            </h3>
                            </ListGroup.Item>
                            <ListGroup.Item className='d-flex justify-content-center'>
                                <Button
                                type='button'
                                variant='primary'
                                disabled={cartItems.length === 0}
                                className='w-100'
                                onClick={checkOutHandler }
                                >
                                    Passer à la caisse
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
    )
}

export default CartPage