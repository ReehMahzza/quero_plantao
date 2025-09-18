// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function SignupPage() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    password: '',
    cpf: '',
    corenNumero: '',
    corenEstado: 'SP', // Valor inicial
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      password: formData.password,
      cpf: formData.cpf,
      coren: {
        numero: formData.corenNumero,
        estado: formData.corenEstado,
      },
    };

    try {
      await axios.post('http://localhost:3000/api/v1/auth/signup/profissional', payload);
      toast.success('Registo realizado com sucesso! Faça o login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error("Erro no registo:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível concluir o registo. Verifique os seus dados.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Criar Conta de Profissional</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nomeCompleto" placeholder="Nome Completo" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <input type="password" name="password" placeholder="Senha" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
          <div className="flex space-x-2">
            <input type="text" name="corenNumero" placeholder="Número do COREN" onChange={handleChange} required className="w-2/3 px-4 py-2 border rounded-md" />
            <select name="corenEstado" onChange={handleChange} value={formData.corenEstado} className="w-1/3 px-4 py-2 border rounded-md">
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              {/* Adicionar outros estados conforme necessário */}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:bg-gray-400">
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Já tem uma conta? <Link to="/login" className="font-medium text-teal-600 hover:underline">Faça o login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;