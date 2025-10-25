// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Lê as credenciais do Firebase a partir das variáveis expostas pelo Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Valida se todas as chaves essenciais foram preenchidas para evitar erros silenciosos.
const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId"
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length) {
  throw new Error(
    `Configuração Firebase ausente: defina ${missingKeys.join(
      ", "
    )} em um arquivo .env com prefixo VITE_`
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporta o serviço de autenticação
