import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth';
import { auth } from '../firebase';
import apiClient from '../api'; // Importa o nosso cliente de API configurado

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do perfil, agora reutilizável
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/profissionais/meu-perfil');
      setUserProfile(response.data);
    } catch (error) {
      console.error("Não foi possível carregar o perfil do utilizador:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchUserProfile(); // Reutiliza a função de busca
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    const authInstance = getAuth();
    await signOut(authInstance);
  };

  // NOVA FUNÇÃO: Expõe a função de busca para ser chamada de qualquer lugar da app
  const refreshUserProfile = async () => {
    if (currentUser) {
      await fetchUserProfile();
    }
  };

  // Expõe a nova função no value do provider
  const value = { currentUser, userProfile, loading, logout, refreshUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

