
import {useContext, useReducer, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import axios from 'axios';
import { UserListReducer } from '../context/user/userReducer';
import { Button } from 'react-bootstrap';
import {toast} from 'react-toastify'

function UserListPage() {
    //STATE:
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, users, loadingDelete, successDelete}, dispatch] = useReducer(UserListReducer , {
        loading: true,
        error: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data
                });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                });
                
            }
        };
        if(successDelete){
          dispatch({type: 'DELETE_RESET'});
        }else{
          fetchData();
        }
        
    }, [userInfo, successDelete]);

    //FUNCTIONS:
    const deleteHandler = async (user) => {
      if(window.confirm('Êtes-vous sûr de vouloir supprimer?')){
        try {
          dispatch({type: 'DELETE_REQUEST'});
          await axios.delete(`/api/users/${user._id}`, {
            headers: {Authorization: `Bearer ${userInfo.token}`}
          });
          toast.success('Supprimé avec succès');
          dispatch({type: 'DELETE_SUCCESS'});
        } catch (err) {
          toast.error(getError(err));
          dispatch({
            type: 'DELETE_FAIL'
          })
          
        }
      }
    }; 

    //RENDERED ELEMENTS:
    return (
    <div>
        <h1>Utilisateurs</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
            <LoadingBox></LoadingBox>
        ): error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
        ): (
            <table className='table'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>NOM</td>
                        <td>EMAIL</td>
                        <td>EST ADMIN</td>
                        <td>ACTIONS</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Oui' : 'Non'}</td>
                            <td>
                              <Button 
                              type='button' 
                              variant='secondary'
                              onClick={() => navigate(`/admin/user/${user._id}`)}
                              >
                                    Éditer
                                </Button>
                                &nbsp;
                                <Button 
                                type='button' 
                                variant='warning'
                                onClick={() => deleteHandler(user)}
                                >
                                  Supprimer
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

export default UserListPage

/*
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  return (
    <div>
      
      <h1>Users</h1>

      {loadingDelete && <LoadingBox></LoadingBox>} 
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
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
*/