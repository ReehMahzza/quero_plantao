// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Importações de componentes do Material-UI
import { CssBaseline, Box, Toolbar } from '@mui/material';

// Importações dos componentes e páginas
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PlantoesPage from './pages/PlantoesPage';
import DetalhePlantaoPage from './pages/DetalhePlantaoPage';
import SignupProfissionalPage from './pages/SignupProfissionalPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MeuPerfilPage from './pages/MeuPerfilPage';
import ProfileCompletionGuard from './components/ProfileCompletionGuard'; // NOVO: Importação do Guardião

const drawerWidth = 240;

/**
 * Define o layout principal da aplicação para rotas protegidas.
 * Inclui a Sidebar, a área de conteúdo principal e o Guardião de Perfil.
 */
const MainLayout = () => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: `calc(100% - ${drawerWidth}px)`,
      }}
    >
      <Toolbar />
      {/* NOVO: O Guardião envolve o Outlet, protegendo todas as rotas filhas */}
      <ProfileCompletionGuard>
        <Outlet />
      </ProfileCompletionGuard>
    </Box>
  </Box>
);

/**
 * Componente para proteger rotas. Redireciona para /login se não houver utilizador.
 */
const ProtectedRoutes = () => {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser ? <MainLayout /> : <Navigate to="/login" />;
};

function App() {
  const { currentUser } = React.useContext(AuthContext);

  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignupPage />} />
        <Route path="/signup/profissional" element={currentUser ? <Navigate to="/" /> : <SignupProfissionalPage />} />
        <Route path="/esqueci-minha-senha" element={currentUser ? <Navigate to="/" /> : <ForgotPasswordPage />} />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plantoes" element={<PlantoesPage />} />
          <Route path="/plantoes/:plantaoId" element={<DetalhePlantaoPage />} />
          <Route path="/meu-perfil" element={<MeuPerfilPage />} />
        </Route>
        
        {/* Rota de Fallback */}
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;

