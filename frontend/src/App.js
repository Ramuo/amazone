import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import {useState, useContext, useEffect} from 'react';
import axios  from 'axios';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Store} from './Store';
import {LinkContainer} from 'react-router-bootstrap';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage'; 
import SigninPage from './pages/SigninPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import SignupPage from './pages/SignupPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderPage from './pages/OrderPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SearchBox from './components/SearchBox';
import {toast} from 'react-toastify';
import {getError} from './utils';
import {
    Navbar, 
    Container,
    Nav,
    Badge,
    NavDropdown,
    Button
} from 'react-bootstrap';
import Footer from './components/Footer'; 

 

function App() {
   //STATE
   const {state, dispatch: ctxDispatch} = useContext(Store);
   const {cart, userInfo} = state;

   


   // state for sidebar is open
   const [sidebarIsOpen, setSidebarIsOpen] = useState();
   const [categories, setCategories] = useState([]);

  // 
   useEffect(() =>{
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchCategories();
   }, []);


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
       window.location.href = '/signin';

       
   };
  
  return (
    <BrowserRouter>
      <div 
      className={
        sidebarIsOpen 
          ? "d-flex flex-column site-container active-cont" 
          : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position='bottom-center' limit={1}/>
        <header>
          <Navbar bg="dark" variant="dark" expand='lg' >
          <Container className='mt-3'>
            <Button
            variant="dark"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className='fas fa-bars'></i>
            </Button>

              <LinkContainer to="/">
              <Navbar.Brand>MEN-STORE+</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav'/>
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox/>
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
        <div
        className={
          sidebarIsOpen
            ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
            : "side-navbar d-flex justify-content-between flex-wrap flex-column"
        }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Catégories</strong>
              {categories.map((category)=> (
                <Nav.Item key={category}>
                  <LinkContainer
                  to={{pathname: '/search', search:`category=${category}`}}
                  onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav.Item>
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/search' element={<SearchPage/>}/>
              <Route path='/signin' element={<SigninPage/>}/>
              <Route path='/signup' element={<SignupPage/>}/>
              <Route path='/profile' element={<ProfilePage/>}/>
              <Route path='/placeorder' element={<PlaceOrderPage/>}/>
              <Route path='/order/:id' element={<OrderPage/>}/>
              <Route path='/orderHistory' element={<OrderHistoryPage/>}/>
              <Route path='/shipping' element={<ShippingPage/>}/>
              <Route path='/payment' element={<PaymentPage/>}/>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
        <Footer/> 
      </div>
    </BrowserRouter>
  );
}

export default App;

