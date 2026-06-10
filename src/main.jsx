import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, domAnimation } from 'framer-motion';
import App from './App';
import './index.css';

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LazyMotion features={domAnimation} strict>
          <App />
        </LazyMotion>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
