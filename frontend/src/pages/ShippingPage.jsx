import {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Store} from '../Store'
import {
    Form,
    FormGroup,
    Button,
 } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps';





function ShippingPage() {
    //STATE
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        userInfo,
        cart: {shippingAddress}  
    } = state;

    const [fullName, setFullName] = useState(shippingAddress.fullName || ' ');
    const [address, setAddress] = useState(shippingAddress.address || ' ');
    const [city, setCity] = useState(shippingAddress.city || ' ');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || ' ');
    const [country, setCountry] = useState(shippingAddress.country || ' ');


    const navigate = useNavigate();

    useEffect(() => {
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    }, [navigate, userInfo]);

    
    //FUNCTION
    //To submit handler
    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
            },
        });
        localStorage.setItem('shippingAddress', JSON.stringify({
            fullName,
            address,
            city,
            postalCode,
            country,
        }));

        navigate('/payment');
    };




    //RENDERED ELEMENTS/
    return (
    <div>
        <CheckoutSteps step1 step2/>
        
        <div className='container small-container'>
            <h1 className="my-3">Livraison</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup className='mb-3' controlId='fullName'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    >
                    </Form.Control>
                </FormGroup>
                <FormGroup className='mb-3' controlId='fullName'>
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    >
                    </Form.Control>
                </FormGroup>
                <FormGroup className='mb-3' controlId='fullName'>
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    >
                    </Form.Control>
                </FormGroup>
                <FormGroup className='mb-3' controlId='fullName'>
                    <Form.Label>Code Postal</Form.Label>
                    <Form.Control
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    >
                    </Form.Control>
                </FormGroup>
                <FormGroup className='mb-3' controlId='fullName'>
                    <Form.Label>Pays</Form.Label>
                    <Form.Control
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    >
                    </Form.Control>
                </FormGroup>

                <div className='mb-3'>
                    <Button variant='primary' type="submit">
                        Continuer
                    </Button>
                </div>
            </Form>
        </div>
    </div>
    )
}

export default ShippingPage