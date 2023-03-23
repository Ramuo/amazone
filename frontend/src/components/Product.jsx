import {useState} from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import {useContext} from 'react';
import {Store} from '../Store';

 
function Product(props) {
    const {product} = props;
    //STATE
    const [outOfStock, setOutOfStock] = useState(false);
    const {state, dispatch: ctxDispatch} = useContext(Store);

    //From state deconstruct cart then cartItems to list cartItems on the CartPage
    const {
        cart: {cartItems},
    } = state;
 
    //FUNCTIONS:
    //TO add to cart from HomePage
    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            setOutOfStock(true);
            window.alert('Désolé, le produit est en rupture de stock');
            return;
        }
        if (outOfStock && data.countInStock >= quantity) {
            setOutOfStock(false);
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: {...item, quantity},
        });
    };
 
    return (
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className="card-img-top" alt={product.name}/>
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews}/>
                <Card.Text><strong>{product.price}€</strong></Card.Text>
                {outOfStock ? (
                    <Button variant="light" disabled>
                        Epuisé
                    </Button>
                ) : (
                    <Button 
                    onClick={() => addToCartHandler(product)}
                    className='w-55'
                    >
                        Ajouter au panier
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}
 
export default Product;

