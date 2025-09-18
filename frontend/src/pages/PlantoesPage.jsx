// src/pages/PlantoesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from '../components/Modal.jsx';
import FormularioPlantao from '../components/FormularioPlantao.jsx';
import { toast } from 'react-hot-toast'; // <-- NOVO: Importa a função toast
import { useNavigate } from 'react-router-dom';

// Função auxiliar para formatar a data do Timestamp do Firestore
const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Data não definida';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Função auxiliar para obter os estilos do status
const getStatusStyles = (status) => {
    switch (status) {
        case 'open':
            return 'bg-blue-100 text-blue-800';
        case 'filled':
            return 'bg-green-100 text-green-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

function PlantoesPage() {
    const navigate = useNavigate();
    const [plantoes, setPlantoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAllPlantoes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/v1/plantoes');
            setPlantoes(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar plantões:", err);
            setError("Não foi possível carregar os plantões.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllPlantoes();
    }, [fetchAllPlantoes]);

    const handleSavePlantao = (formData) => {
      // 1. Prepara a chamada à API como uma função assíncrona
      const promiseDeSalvar = async () => {
        try {
          const dadosFormatados = {
            instituicaoId: "n0tzxsZjZmvC6AhDpyd2", // ID de instituição para teste
            titulo: formData.titulo,
            descricao: formData.descricao,
            dataInicio: new Date(formData.dataInicio).toISOString(),
            dataFim: new Date(formData.dataFim).toISOString(),
            valorOferecido: Number(formData.valorOferecido),
            endereco: {
              cep: formData.cep,
              logradouro: formData.logradouro,
              numero: formData.numero,
              bairro: formData.bairro,
              cidade: formData.cidade,
              estado: formData.estado
            }
          };

          await axios.post('http://localhost:3000/api/v1/plantoes', dadosFormatados);

          // Se a chamada for bem-sucedida, atualizamos os dados e fechamos o modal
          await fetchAllPlantoes();
          setIsModalOpen(false);

        } catch (err) {
          // Se ocorrer um erro na chamada da API, lançamos o erro
          // para que o toast.promise possa apanhá-lo e mostrar a mensagem de erro.
          console.error("Erro detalhado ao salvar o plantão:", err);
          throw new Error("Falha ao criar o plantão. Verifique os dados.");
        }
      };

      // 2. Passa a função (a Promise) diretamente para o toast.promise
      toast.promise(
        promiseDeSalvar(), // Executamos a função aqui para que a Promise seja passada
        {
          loading: 'A publicar plantão...',
          success: 'Plantão publicado com sucesso!',
          error: 'Ocorreu um erro ao publicar o plantão.',
        }
      );
    };

    const renderTableBody = () => {
        if (loading) return <tr><td colSpan="5" className="p-4 text-center text-gray-500">A carregar...</td></tr>;
        if (error) return <tr><td colSpan="5" className="p-4 text-center text-red-500">{error}</td></tr>;
        if (plantoes.length === 0) return <tr><td colSpan="5" className="p-4 text-center text-gray-500">Nenhum plantão encontrado.</td></tr>;

        return plantoes.map((plantao) => (
            <tr key={plantao.id} className="border-t hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/plantoes/${plantao.id}`)}>
                <td className="p-4 text-gray-800">{formatDate(plantao.dataInicio)}</td>
                <td className="p-4 text-gray-800">{plantao.profissionalInfo?.nomeCompleto || 'N/A'}</td>
                <td className="p-4 text-gray-800">{plantao.titulo}</td>
                <td className="p-4 text-gray-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plantao.valorOferecido)}
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-sm font-semibold capitalize rounded-full ${getStatusStyles(plantao.status)}`}>
                        {plantao.status}
                    </span>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestão de Plantões</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Publicar Novo Plantão
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Buscar..." className="p-2 border border-gray-300 rounded-md" />
                    <select className="p-2 border border-gray-300 rounded-md">
                        <option value="">Todos os Status</option>
                        <option value="open">Abertos</option>
                        <option value="filled">Preenchidos</option>
                    </select>
                    <input type="date" className="p-2 border border-gray-300 rounded-md" />
                    <input type="date" className="p-2 border border-gray-300 rounded-md" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Data e Hora</th>
                            <th className="p-4 font-semibold text-gray-600">Profissional</th>
                            <th className="p-4 font-semibold text-gray-600">Cargo</th>
                            <th className="p-4 font-semibold text-gray-600">Valor</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormularioPlantao
                    onCancel={() => setIsModalOpen(false)}
                    onSave={handleSavePlantao}
                />
            </Modal>
        </div>
    );
}

export default PlantoesPage;

