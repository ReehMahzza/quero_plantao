// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api';

function DashboardPage() {
  // --- ESTADOS DO COMPONENTE ---

  // Estado para armazenar a lista de plantões vinda da API. Começa como um array vazio.
  const [plantoes, setPlantoes] = useState([]);

  // Estado para controlar a exibição de um feedback de carregamento. Começa como 'true'.
  const [loading, setLoading] = useState(true);

  // Estado para armazenar qualquer erro que ocorra durante a chamada à API.
  const [error, setError] = useState(null);

  // --- EFEITO PARA BUSCAR DADOS ---

  // O useEffect com um array de dependências vazio ([]) executa esta função
  // apenas uma vez, quando o componente é "montado" (carregado) na tela.
  useEffect(() => {
    // Função assíncrona para buscar os dados dos plantões.
    const fetchPlantoes = async () => {
      try {
        // Faz a requisição GET para o endpoint do backend.
        const response = await apiClient.get('/plantoes');

        // Se a requisição for bem-sucedida, atualiza o estado com os dados recebidos.
        setPlantoes(response.data);
      } catch (err) {
        // Se ocorrer um erro, armazena a mensagem de erro no estado.
        console.error("Erro ao buscar plantões:", err);
        setError("Não foi possível carregar os plantões. Tente novamente mais tarde.");
      } finally {
        // Independentemente de sucesso ou erro, define o loading como 'false' ao final.
        setLoading(false);
      }
    };

    fetchPlantoes(); // Chama a função para iniciar a busca.
  }, []); // O array vazio garante que o efeito rode apenas uma vez.

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // Se ainda estiver carregando, exibe uma mensagem de loading.
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">A carregar plantões...</p>
      </div>
    );
  }

  // Se ocorreu um erro, exibe a mensagem de erro.
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL (DADOS CARREGADOS) ---

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Plantões Abertos</h1>

      {/* Verifica se a lista de plantões está vazia */}
      {plantoes.length === 0 ? (
        <p className="text-gray-600">Nenhum plantão aberto encontrado no momento.</p>
      ) : (
        // Se houver plantões, cria um grid para os cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapeia o array de plantões e renderiza um card para cada um */}
          {plantoes.map((plantao) => (
            <div key={plantao.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{plantao.titulo}</h2>
              <p className="text-gray-500 mb-4">{plantao.instituicaoInfo.nomeFantasia}</p>
              <div className="text-teal-600 font-semibold text-lg">
                {/* Formata o valor como moeda brasileira */}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plantao.valorOferecido)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
