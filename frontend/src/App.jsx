// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Importações de componentes do Material-UI
import { CssBaseline, Box, Toolbar } from '@mui/material';

// Importações dos componentes e páginas
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SignupProfissionalPage from './pages/SignupProfissionalPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MeuPerfilPage from './pages/MeuPerfilPage';
import PerfilProfissionalPage from './pages/PerfilProfissionalPage'; // <-- NOVO
import ProfileCompletionGuard from './components/ProfileCompletionGuard';
import GestaoPlantoesContainer from './pages/GestaoPlantoesContainer'; // <-- Refatorado/Novo
import CandidaturasPage from './pages/CandidaturasPage';   // <-- Refatorado/Novo

const drawerWidth = 240;

const MainLayout = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 65px)`,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <ProfileCompletionGuard>
          <Outlet />
        </ProfileCompletionGuard>
      </Box>
    </Box>
  );
};

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
          {/* Rota atualizada para a nova página de gestão */}
          <Route path="/gestao-plantoes" element={<GestaoPlantoesContainer />} />
          {/* Rota atualizada para a nova página de candidaturas */}
          <Route path="/plantoes/:plantaoId/candidaturas" element={<CandidaturasPage />} />
          <Route path="/meu-perfil" element={<MeuPerfilPage />} />
          <Route path="/perfis/:profissionalId" element={<PerfilProfissionalPage />} />
        </Route>
        
        {/* Rota de Fallback */}
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;