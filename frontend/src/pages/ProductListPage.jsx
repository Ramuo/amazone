
import {useContext, useEffect, useReducer} from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store'; 
import { getError } from '../utils';
import {toast} from 'react-toastify';
import { ProductListReducer } from '../context/products/ProductsReducer'; 
import { Row, Button, Col } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';



function ProductListPage() {
    //STATE:
    const [
      {
        loading,
        error,
        products,
        pages,
        loadingCreate,
        loadingDelete,
        successDelete,
      },
      dispatch,
    ] = useReducer(ProductListReducer, {
      loading: true,
      error: '',
    });
    const navigate = useNavigate();
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/products/admin?page=${page}`, {
                   headers: { Authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data})
            } catch (err) {
                  
            }
        };

        if(successDelete){
          dispatch({type: 'DELETE_RESET'});
        }else{
          fetchData();
        }
    }, [page, userInfo, successDelete]);


    //FUNCTIONS:
    //to create product
    const createHandler = async () => {
      if (window.confirm('Êtes-vous sûr de créer ?')) {
        try {
          dispatch({ type: 'CREATE_REQUEST' });
          const { data } = await axios.post(
            '/api/products',
            {},
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          toast.success('Produit créé avec succès');
          dispatch({ type: 'CREATE_SUCCESS' });
          navigate(`/admin/product/${data.product._id}`);
        } catch (err) {
          toast.error(getError(error));
          dispatch({
            type: 'CREATE_FAIL',
          });
        }
      }
    };

    //to delete product
    const  deleteHandler = async (product) => {
      if(window.confirm('Êtes-vous sûr de supprimer ce produit ?')){
        try {
            await axios.delete(`/api/products/${product._id}`, {
              headers: {Authorization: `Bearer ${userInfo.token}`}
            });
            toast.success('Produit supprimé avec succès');
            dispatch({type: 'DELETE_SUCCESS'})
        } catch (err) {
          toast.error(getError(err));
          dispatch({
            type: 'DELETE_FAIL'
          });
        }
      }
    }


    //RENDERED ELEMENT:
    return (
    <div>
        <Row>
            <Col><h1>Produits</h1></Col>
            <Col className='col text-end'>
                <div>
                    <Button 
                    type='button' 
                    onClick={createHandler}
                    >
                        Créer un produit
                    </Button>
                </div>
            </Col>
        </Row>

        {loadingCreate && <LoadingBox></LoadingBox>}
        {loadingDelete && <LoadingBox></LoadingBox>}

        {loading ? (
            <LoadingBox></LoadingBox>   
        ): error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
        ): (
            <>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOM</th>
                            <th>PRIX</th>
                            <th>CATEGORIE</th>
                            <th>MARQUE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}€</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                  <Button
                                  type='button'
                                  variant='secondary'
                                  onClick={() => navigate(`/admin/product/${product._id}`)}
                                  >
                                   Éditer 
                                  </Button>&nbsp;
                                  <Button
                                  type='button'
                                  variant='warning'
                                  onClick={() => deleteHandler(product)}
                                  >
                                   Supprimer
                                  </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {[...Array(pages).keys()].map((x) => (
                        <Link
                        className={x + 1 === Number(page) ?  'btn text-bold' : 'btn'}
                        key={x + 1}
                        to={`/admin/products?page=${x + 1}`}
                        >
                            {x + 1}
                        </Link>
                    ))}
                </div>
            </>
        )}
    </div>
    )
}

export default ProductListPage


