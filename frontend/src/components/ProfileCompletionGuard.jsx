import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Um componente "guardião" que protege rotas, garantindo que o perfil do utilizador
 * esteja completo antes de permitir o acesso.
 *
 * - Se o perfil estiver pendente, força o redirecionamento para a página de edição de perfil.
 * - Se o perfil estiver completo, permite o acesso à rota solicitada.
 * - Exibe um indicador de carregamento enquanto o perfil é verificado.
 */
function ProfileCompletionGuard() {
  const { userProfile, loading } = useAuth();
  const location = useLocation();

  // 1. Enquanto o AuthContext está a carregar o utilizador e o seu perfil,
  //    exibimos um indicador de carregamento em tela cheia.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Após o carregamento, verificamos o status do perfil.
  //    Se o perfil estiver 'pendente' e o utilizador NÃO estiver a tentar aceder
  //    à página para completar o perfil, nós o redirecionamos para lá.
  if (userProfile?.statusDoPerfil === 'pendente' && location.pathname !== '/meu-perfil') {
    return <Navigate to="/meu-perfil" replace />;
  }

  // 3. Se o perfil estiver completo, ou se o utilizador já estiver na página de perfil,
  //    permitimos que a rota solicitada seja renderizada.
  return <Outlet />;
}

export default ProfileCompletionGuard;
