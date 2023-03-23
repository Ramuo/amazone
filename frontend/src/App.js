import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage'; 
import SigninPage from './pages/SigninPage';
import ShippingPage from './pages/ShippingPage';
import {Container} from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';



function App() {
  
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position='bottom-center' limit={1}/>
        <Header/>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/signin' element={<SigninPage/>}/>
              <Route path='/shipping' element={<ShippingPage/>}/>
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

