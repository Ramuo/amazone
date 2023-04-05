

import axios from 'axios';
import { useEffect, useReducer, useContext, useRef , useState} from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Form,
  FloatingLabel
} from 'react-bootstrap';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {getError} from '../utils';
import {Store} from '../Store';
import {ProductReducer} from '../context/products/ProductsReducer';
import {toast} from 'react-toastify';




function ProductPage() {
  //STATE:
  const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(ProductReducer, {
    product: [],
    loading: true,
    error: '',
  });

   //Let us bring in state and dispatch from useContext
   const {state, dispatch: ctxDispatch} = useContext(Store);
   const {cart, userInfo} = state;

   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [selectedImage, setSelectedImage] = useState('');

  let reviewsRef = useRef();

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    fetchData();
  }, [slug]);


  //FUNCTIONS:
  const addToCartHandler = async () => {
    
    const existItem = cart.cartItems.find((x) => x._id === product._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    const {data} = await axios.get(`/api/products/${product._id}`);

    if(data.countInStock < quantity){
      window.alert('Désolé, le produit est en rupture de stock!');
      return 
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM', 
      payload: {...product, quantity},
    });

    navigate('/cart');
  };

  //To submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if(!comment || ! rating){
      toast.error('Laisser un commentaire et votre avis');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({
          type: 'CREATE_SUCCESS',
        });
        toast.success('Review submitted successfully');
        product.reviews.unshift(data.review);
        product.numReviews = data.numReviews;
        product.rating = data.rating;
        dispatch({ type: 'REFRESH_PRODUCT', payload: product });
        window.scrollTo({
          behavior: 'smooth',
          top: reviewsRef.current.offsetTop,
        });
    } catch (err) {
      toast.error(getError(err));
      dispatch({type: 'CREATE_FAIL'});
      
    }
  }

  //RENDERED ELEMENTS
  return loading ? (
    <LoadingBox/>
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  )  : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={ selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
                <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Prix : {product.price}€</ListGroup.Item>

            <ListGroup.Item>
            <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Prix:</Col>
                    <Col>{product.price}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Stock:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Disponible</Badge>
                      ) : (
                        <Badge bg="danger">Epuisé</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button 
                      variant="primary"
                      onClick={addToCartHandler}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className='mb-3'>
        <h2 ref={reviewsRef}>Avis</h2>
      </div>
      <div className='mb-3'>
        {product.reviews.length === 0 && (
          <MessageBox variant='info'>Aucun avis pour le moment</MessageBox>
        )}
      </div>
      <ListGroup>
        {product.reviews.map((review) => (
          <ListGroup.Item key={review._id}>
            <strong>{review.name}</strong>
            <Rating rating={review.rating} caption=" "></Rating>
            <p>{review.createdAt.substring(0, 10)}</p>
            <p>{review.comment}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className='mb-3'>
        {userInfo ? (
          <Form onSubmit={submitHandler}>
            <h2>Laisser nous votre avis</h2>
            <Form.Group className='mb-3' controlId="rating">
              <Form.Label>Avis</Form.Label>
              <Form.Select
              aria-label='Rating'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Choisir...</option>
                <option value="1">1 étoile</option>
                <option value="2">2 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="5">5 étoiles</option>
              </Form.Select>
            </Form.Group>
            <FloatingLabel
                controlId="floatingTextarea"
                label="Commentaire"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Laisser un commentaire"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Envoyer
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
          </Form>
        ): (
          <MessageBox variant='info'>
            <Link to={`/signin?redirect=/product/${product.slug}`}>
              S'identifier
            </Link>{' '}
            pour laisser un avis
          </MessageBox>
        )}
      </div>
    </div>
  );
}
export default ProductPage;
