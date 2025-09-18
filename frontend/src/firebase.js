// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ATENÇÃO: Substitua este objeto pelas credenciais do SEU projeto Firebase!
const firebaseConfig = {
  apiKey: "AIzaSyDfs5F17YxL_L2uZY8W02hmEKF_e_Yl5O8",
  authDomain: "quero-plantao-793ef.firebaseapp.com",
  projectId: "quero-plantao-793ef",
  storageBucket: "quero-plantao-793ef.firebasestorage.app",
  messagingSenderId: "586732735949",
  appId: "1:586732735949:web:671eed4547e50ae1b68884",
  measurementId: "G-K45XSEWC7Z"
};

// Onde encontrar estas credenciais:
// 1. Vá para o Console do Firebase (console.firebase.google.com)
// 2. Selecione o seu projeto "Quero Plantao".
// 3. Clique na engrenagem (⚙️) > Configurações do Projeto.
// 4. Na aba "Geral", role para baixo até "Seus apps".
// 5. Clique no ícone </> para ver a configuração do app da web e copie os valores.

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporta o serviço de autenticação