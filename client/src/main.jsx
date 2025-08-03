import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';

const slideAnimation = (
  <GlobalStyles
    styles={ {
      '@keyframes slide': {
        from: { right: '-25vw' },
        to: { right: '125vw' },
      },
    } }
  />
);

// IMPORTANT: Replace this with your actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={ GOOGLE_CLIENT_ID }>
      <BrowserRouter>
        <AuthProvider>
          { slideAnimation }
          <CssBaseline />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
