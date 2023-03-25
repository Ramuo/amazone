import {useContext} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router-dom';
import {Store} from '../Store';
import {
    Navbar, 
    Container,
    Nav,
    Badge,
    NavDropdown
} from 'react-bootstrap';

function Header() {
    //STATE
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart, userInfo} = state;


    //FUNCTIONS:
    //To signOut user
    const signoutHandler = () => {
        ctxDispatch({
            type: 'SINGN_OUT',
        });

        //To remove userInfo from localStorage
        localStorage.removeItem('userInfo');

        //To remove shippingAddress from localStorage
        localStorage.removeItem('shippingAddress');

        //To remove paymentMethod from localStorage
        localStorage.removeItem('paymentMethod');
    };

    //RENDERED ELEMENTS:
    return (
    <header>
        <Navbar bg="dark" variant="dark" expand='lg' >
        <Container className='mt-3'>
            <LinkContainer to="/">
            <Navbar.Brand>amazone+</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='me-auto w-100 justify-content-end' >
                <Link to='/cart' className='nav-link'>
                    Panier
                    {cart.cartItems.length > 0 && (
                    <Badge  pill bg='danger'>
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                    )}
                </Link>

                {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to='profile'>
                            <NavDropdown.Item>
                                Profil
                            </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/orderhistory'>
                            <NavDropdown.Item>
                                Historique des commandes
                            </NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link
                        className='dropdown-item'
                        to='#signout'
                        onClick={signoutHandler}
                        >
                            Se déconnecter
                        </Link>
                </NavDropdown> 
                ) : (
                    <Link className="nav-link" to="/signin">
                        S'identifier
                    </Link>
                )}
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
    )
}

export default Header