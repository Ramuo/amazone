import {Container, Row, Col} from 'react-bootstrap';


function Footer() {
  return (
    <footer>
        <Container>
          <Row>
            <Col className="text-center">
            {new Date().getFullYear()} Copyright &copy; MEN-STORE+
            </Col>
          </Row>
        </Container>
    </footer>
  )
}

export default Footer