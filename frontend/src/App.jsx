// src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

import Sidebar from './components/Sidebar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PlantoesPage from './pages/PlantoesPage.jsx';
import DetalhePlantaoPage from './pages/DetalhePlantaoPage.jsx';

// Componente para agrupar o layout principal (Sidebar + Conteúdo)
const MainLayout = () => (
  <div className="flex bg-gray-100 min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <Outlet /> {/* O Outlet renderiza o componente da rota filha */}
    </main>
  </div>
);

// Componente para proteger rotas. Se não houver utilizador, redireciona para /login.
const ProtectedRoutes = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <MainLayout /> : <Navigate to="/login" />;
};

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Routes>
      {/* Rotas Públicas */}
      {/* Se o utilizador já estiver logado, redireciona do login/signup para o dashboard */}
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignupPage />} />

      {/* Rotas Protegidas */}
      {/* Todas as rotas aqui dentro exigem que o utilizador esteja logado */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/plantoes" element={<PlantoesPage />} />
        <Route path="/plantoes/:plantaoId" element={<DetalhePlantaoPage />} />
        {/* Adicione outras rotas protegidas aqui no futuro */}
      </Route>

      {/* Rota de Fallback: se nenhuma rota corresponder, redireciona */}
      <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;