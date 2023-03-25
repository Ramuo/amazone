import React from 'react';
import ReactDOM from 'react-dom/client';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap.min.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './Store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        <App />
      </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>
);


reportWebVitals();
