import {useContext,  useState, useReducer} from 'react';
import axios from 'axios';
import {Store} from '../Store';
import {toast} from 'react-toastify';
import {getError} from '../utils';
import {
    Form,
    Button,
} from 'react-bootstrap';

const reducer = (state, action) =>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loadingUpdate: true};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
        case 'FETCH_FAIL':
            return {...state, loadingUpadate: false};
        default:
            return state;
    }
}



function ProfilePage() {
    //STATE
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState(' ');
    const [confirmPassword, setConfirmPassword] = useState(' ');

    const [{loadingUpdate}, dispatch] = useReducer(reducer, {
        loadingUpadate: false,
    });


    //FUNCTIONS
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const {data} = await axios.put(`/api/users/profile`, {
                name,
                email,
                password
            },
            {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });

            dispatch({
                type: 'UPDATE_SUCCESS'
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Le profil a été modifié ');
        } catch (error) {
            dispatch({
                type: 'FETCH_FAIL',
            });
            toast.error(getError(error));
        }
    }



    //RENDERED ELEMENTS:
    return (
        <div className='container small-container'>
            <h1 className='my-3'> Votre Profil</h1>
            <Form onSubmit={onSubmitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Confirmer votre mot de passe</Form.Label>
                    <Form.Control
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <div className='mb-3'>
                    <Button type='submit'>Modifier</Button>
                </div>
            </Form>
        </div>
    )
}

export default ProfilePage