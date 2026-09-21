import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import ToastProvider from './components/Toast';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <ToastProvider>
        <App />
        <Analytics />
      </ToastProvider>
    </BrowserRouter>
  </HelmetProvider>
);