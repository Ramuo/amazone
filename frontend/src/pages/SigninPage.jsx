import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {Store} from '../Store';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import {
    Form,
    FormGroup,
    Button
} from 'react-bootstrap'; 
import FormContainer from '../components/FormContainer';
import {toast} from 'react-toastify';





function SigninPage() {
    //STATE
    const {search} = useLocation();
    const navigate = useNavigate();

    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(' ');

    //To access context created in Store
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    //FUNCTIONS:
    // To submit signIn
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/api/users/signin', {
                email,
                password,
            });

            ctxDispatch({
                type: 'USER_SIGNIN',
                payload: data
            });

            localStorage.setItem('userInfo', JSON.stringify(data));

            navigate(redirect || '/');
        } catch (error) {
            toast.error('Email ou Mot de passe invalide');
        }
    }

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    //RENDERED ELEMENTS:
    return (
        <FormContainer>
            <h1 className='my-3'>S'IDENTIFIER</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                    type='email' 
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className='mb-3' controlId='password'>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control 
                    type='password' 
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <div className='mb-3'>
                    <Button type='submit'>Envoyer</Button>
                </div>
                <div className='mb-3'>
                    Vous n'avez pas encore de compte ?{' '}
                    <Link to={`/signup?/redirect=${redirect}`}>Créer un compte</Link>
                </div>
            </Form>
        </FormContainer>
    )
}

export default SigninPage