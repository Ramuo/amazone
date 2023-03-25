import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Store} from '../Store';
import {Form, Button} from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentPage() {
    //STATE
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {shippingAddress, paymentMethod},
    } = state;

    const [paymentMethodName, setPaymentMethod] = useState(
        paymentMethod || 'PayPal'
    );

    const navigate = useNavigate();


    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    }, [shippingAddress, navigate])


    //FUNCTIONS:
    const submitHandler = (e) => {
        e.preventDefault();

        ctxDispatch({ 
            type: 'SAVE_PAYMENT_METHOD', 
            payload: paymentMethodName 
        });

        localStorage.setItem('paymentMethod', paymentMethodName);
        
        navigate('/placeorder');
    };


    //RENDERED ELEMENTS/
    return (
        <div>
          <CheckoutSteps step1 step2 step3></CheckoutSteps>
          <div className="container small-container">
            <h1 className="my-3">Methode de paiement</h1>
            <Form onSubmit={submitHandler}>
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="PayPal"
                  label="PayPal"
                  value="PayPal"
                  checked={paymentMethodName === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="Stripe"
                  label="Stripe"
                  value="Stripe"
                  checked={paymentMethodName === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Button type="submit">Continuer</Button>
              </div>
            </Form>
          </div>
        </div>
    );
}

export default PaymentPage