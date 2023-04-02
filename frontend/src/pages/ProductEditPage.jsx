import {useContext, useReducer, useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';
import { Store } from '../Store';
import { ProductEditReducer } from '../context/products/ProductsReducer';
import {Button, Container, Form, FormGroup, FormLabel} from 'react-bootstrap'
import { getError } from '../utils';
import {toast} from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function ProductEditPage() {
    //STATE
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, loadingUpdate, loadingUpload}, dispatch] = useReducer(ProductEditReducer, {
        loading: true,
        error: ''
    });

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    //const { id } = useParams()
    const params = useParams();
    const {id: productId} = params
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setPrice(data.price);
                setImage(data.image);
                setImages(data.images);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setBrand(data.brand);
                setDescription(data.description);

                dispatch({type: 'FETCH_SUCCESS'});

            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIl',
                    payload: getError(err)
                });
            }
        };

        fetchData();
    }, [productId]);


    //FUNCTIONS:
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          dispatch({ type: 'UPDATE_REQUEST' });
          await axios.put(
            `/api/products/${productId}`,
            {
              _id: productId,
              name,
              slug,
              price,
              image,
              images,
              category,
              brand,
              countInStock,
              description,
            },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({
            type: 'UPDATE_SUCCESS',
          });
          toast.success('Product updated successfully');
          navigate('/admin/products');
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'UPDATE_FAIL' });
        }
      };

      const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({type: 'UPLOAD_REQUEST'});
            const {data} = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            });

            dispatch({type: 'UPLOAD_SUCCESS'});

            toast.success('Image téléchargée avec succès');
            setImage(data.secure_url)
        } catch (err) {
            toast.error(getError(err));
            dispatch({type: 'UPLOAD_FAIL', payload: getError(err)});
        }
      };


    //RENDERED ELEMENTS:
    return (
        <Container className='small-container'>
            <h1>Éditer produit : {productId}</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ): error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ):(
                <Form onSubmit={submitHandler}>
                    <FormGroup className='mb-3' controlId='name'>
                        <FormLabel>Nom</FormLabel>
                        <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='slug'>
                        <FormLabel>Slug</FormLabel>
                        <Form.Control
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='price'>
                        <FormLabel>Prix</FormLabel>
                        <Form.Control
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='image'>
                        <FormLabel>Image</FormLabel>
                        <Form.Control
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>
                    <FormGroup className='mb-3' controlId='imageFile'>
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control type='file' onChange={uploadFileHandler}/>
                        {loadingUpload && <LoadingBox></LoadingBox>}
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='category'>
                        <FormLabel>Categorie</FormLabel>
                        <Form.Control
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='brand'>
                        <FormLabel>Marque</FormLabel>
                        <Form.Control
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='countInStock'>
                        <FormLabel>Stock</FormLabel>
                        <Form.Control
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup className='mb-3' controlId='description'>
                        <FormLabel>Description</FormLabel>
                        <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>

                    <div className='mb-3'>
                        <Button disabled={loadingUpdate} type='submit'>Mettre à jour</Button>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                    </div>
                </Form>
            )}
        </Container>
    )
}

export default ProductEditPage