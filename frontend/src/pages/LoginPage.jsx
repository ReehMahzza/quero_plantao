// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await toast.promise(
      signInWithEmailAndPassword(auth, formData.email, formData.password),
      {
        loading: 'A autenticar...',
        success: 'Login efetuado com sucesso!',
        error: (err) => {

          // Firebase retorna erros com códigos específicos, podemos traduzi-los.
          switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              return 'Email ou senha inválidos.';
            default:
              return 'Ocorreu um erro no login.';
          }
        },
      }
    );
    setLoading(false);

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login do Profissional</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <input type="password" name="password" placeholder="Senha" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:bg-gray-400">
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Não tem uma conta? <Link to="/signup" className="font-medium text-teal-600 hover:underline">Registe-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;