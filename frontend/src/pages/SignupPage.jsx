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





function SignupPage() {
    //STATE
    const {search} = useLocation();
    const navigate = useNavigate();

    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(' ');
    const [confirmPassword, setConfirmPassword] = useState(' ');

    //To access context created in Store
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    //FUNCTIONS:
    // To submit signIn
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // To confirm password
        if(password !== confirmPassword){
            toast.error('Mot de passe ne correspond pas');
            return;
        }

        try {
            const {data} = await axios.post('/api/users/signup', {
                name,
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
            <h1 className='my-3'>S'INSCRIRE</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup className='mb-3' controlId='name'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control 
                    type='text' 
                    required
                    onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
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
                <FormGroup className='mb-3' controlId='confirmPassword'>
                    <Form.Label>Corfirmer le mot de passe</Form.Label>
                    <Form.Control 
                    type='password' 
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormGroup>
                <div className='mb-3'>
                    <Button type='submit'>Envoyer</Button>
                </div>
                <div className='mb-3'>
                    Vous avez déjà un compte?{' '}
                    <Link to={`/signin?/redirect=${redirect}`}>S'identifier</Link>
                </div>
            </Form>
        </FormContainer>
    )
}

export default SignupPage