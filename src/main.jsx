import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { MenuProvider } from './context/MenuContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { RatingsProvider } from './context/RatingsContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OrdersProvider>
      <MenuProvider>
        <FavoritesProvider>
          <RatingsProvider>
            <CartProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </CartProvider>
          </RatingsProvider>
        </FavoritesProvider>
      </MenuProvider>
    </OrdersProvider>
  </React.StrictMode>,
);
