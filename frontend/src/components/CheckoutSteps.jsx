import {
    Row,
    Col,
} from 'react-bootstrap'

function CheckoutSteps({step1, step2, step3, step4}) {


    return <Row className='checkout-steps'>
        <Col className={step1 ? 'active' :  ' '}>S'identifier</Col>
        <Col className={step2 ? 'active' :  ' '}>Livraison</Col>
        <Col className={step3 ? 'active' :  ' '}>Paiement</Col>
        <Col className={step4 ? 'active' :  ' '}> Valider</Col>
    </Row>
    
}

export default CheckoutSteps