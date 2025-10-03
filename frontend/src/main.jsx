import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

// NOVO: Importações do MUI e do tema customizado
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* O ThemeProvider envolve a aplicação, fornecendo o tema */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Garante a normalização do estilo */}
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#dcfce7',
                  color: '#166534',
                },
              },
              error: {
                style: {
                  background: '#fee2e2',
                  color: '#991b1b',
                },
              },
            }}
          />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
