// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// NOVO: Importações do MUI para o tema
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PlantoesPage from './pages/PlantoesPage';
import DetalhePlantaoPage from './pages/DetalhePlantaoPage';

// NOVO: Definição de um tema básico para a aplicação
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Um tom de verde-azulado (teal)
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const MainLayout = () => (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
  
const ProtectedRoutes = () => {
    const { currentUser } = React.useContext(AuthContext);
    return currentUser ? <MainLayout /> : <Navigate to="/login" />;
};

function App() {
  const { currentUser } = React.useContext(AuthContext);

  return (
    // NOVO: Envolve toda a aplicação com o ThemeProvider e o CssBaseline
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reseta o CSS para garantir consistência */}
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignupPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plantoes" element={<PlantoesPage />} />
          <Route path="/plantoes/:plantaoId" element={<DetalhePlantaoPage />} />
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
      </Routes>
    </ThemeProvider>
  );
}

// Envolvemos o App com o AuthProvider para que o App possa usar o contexto
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;

