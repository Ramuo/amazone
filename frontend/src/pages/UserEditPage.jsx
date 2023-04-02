import {useReducer, useState, useEffect, useContext} from 'react';
import { UserEditReducer } from '../context/user/userReducer';
import { useParams, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import {toast} from 'react-toastify';
import { Container, Button, Form, FormGroup, FormLabel } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';





function UserEditPage() {
  //STATE:
  const {state} = useContext(Store);
  const {userInfo} = state;

  const [{loading, error, loadingUpdate}, dispatch] = useReducer(UserEditReducer, {
    loading: true,
    error: ''
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const {id: userId} = params; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});
        const {data} = await axios.get(`/api/users/${userId}`, {
          headers: {Authorization: `Bearer ${userInfo.token}`}
        });

        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);

        dispatch({
          type: 'FETCH_SUCCESS'
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err)
        });
      }
    };
    fetchData();
  }, [userInfo, userId]);


  //FUNCTIONS:
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({type: 'UPDATE_REQUEST'});
      await axios.put(`/api/users/${userId}`, 
      {
        _id: userId, 
        name,
        email,
        isAdmin
      },
      {
        headers: {Authorization: `Bearer ${userInfo.token}`}
      });
      dispatch({
        type: 'UPDATE_SUCCESS'
      });
      toast.success('Modifié avec succès');
      navigate(`/admin/users`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: 'UPDATE_FAIL'
      });
      
    }
  }


  //RENDERED ELEMENT:
  return (
    <Container className='small-container'>
            <h1>Éditer l'utilisateur : {userId}</h1>
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
                    <FormGroup className='mb-3' controlId='email'>
                        <FormLabel>Email</FormLabel>
                        <Form.Control
                        value={email}
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        ></Form.Control>
                    </FormGroup>
                    <Form.Check
                    className='mb-3'
                    type='checkbox'
                    id='isAdmin'
                    label='isAdmin'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    ></Form.Check>

                    <div className='mb-3'>
                        <Button 
                        disabled={loadingUpdate} 
                        type='submit'
                        >
                          Mettre à jour
                        </Button>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                    </div>
                </Form>
            )}
        </Container>
  )
}

export default UserEditPage