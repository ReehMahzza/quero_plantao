import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Cria uma instância do axios com a URL base da nossa API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Este é o "interceptor". Ele age como um porteiro para cada requisição que sai.
apiClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {

      // Se o utilizador estiver logado, pega o token mais recente.
      const token = await user.getIdToken();

      // Adiciona o token ao cabeçalho de Autorização.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;