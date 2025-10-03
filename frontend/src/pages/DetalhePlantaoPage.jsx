// src/pages/DetalhePlantaoPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// --- Funções Auxiliares ---

const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// --- Componentes Internos para Melhor Organização ---

// Componente para exibir os detalhes do plantão
const PlantaoInfo = ({ plantao }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{plantao.titulo}</h1>
        <p className="text-gray-600 mt-2">{plantao.descricao}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
                <p className="font-semibold text-gray-500">Início:</p>
                <p>{formatDate(plantao.dataInicio)}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-500">Fim:</p>
                <p>{formatDate(plantao.dataFim)}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-500">Valor:</p>
                <p className="text-green-600 font-bold text-base">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plantao.valorOferecido)}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-500">Status:</p>
                <p className="capitalize font-medium">{plantao.status}</p>
            </div>
        </div>
        {plantao.status === 'filled' && plantao.profissionalInfo && (
            <div className="mt-4 pt-4 border-t">
                <p className="font-semibold text-gray-500">Profissional Alocado:</p>
                <p className="text-teal-700 font-bold">{plantao.profissionalInfo.nomeCompleto}</p>
            </div>
        )}
    </div>
);

// Componente para exibir um único item da lista de candidatos
const CandidatoItem = ({ candidato, plantaoStatus, onAprovar, isApproving }) => {
    const isThisOneApproving = isApproving === candidato.id;
    return (
        <div key={candidato.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
            <div>
                <p className="font-bold text-gray-900">{candidato.profissionalInfo.nomeCompleto}</p>
                <div className="flex items-center mt-1">
                     {/* Adicionando a avaliação média */}
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="text-sm text-gray-600 mr-4">
                        {candidato.profissionalInfo.avaliacaoMedia?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-500">Status: <span className="capitalize font-medium">{candidato.status}</span></span>
                </div>
            </div>
            <div>
                {plantaoStatus === 'open' && candidato.status === 'pending' && (
                    <button
                        onClick={() => onAprovar(candidato.id)}
                        disabled={isApproving} // Desabilita o botão durante a aprovação
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isThisOneApproving ? 'A processar...' : 'Aprovar'}
                    </button>
                )}
                {candidato.status === 'approved' && (
                     <span className="text-green-600 font-bold">Aprovado</span>
                )}
                 {candidato.status === 'rejected' && (
                     <span className="text-red-600 font-bold">Rejeitado</span>
                 )}
            </div>
        </div>
    );
};

// --- Componente Principal da Página ---

function DetalhePlantaoPage() {
    // --- State Hooks ---
    const { plantaoId } = useParams();
    const navigate = useNavigate();
    const [plantao, setPlantao] = useState(null);
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApproving, setIsApproving] = useState(null); // Novo estado para controlar o loading da aprovação

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        try {
            // Busca os dados em paralelo para mais performance
            const [plantaoRes, candidaturasRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/plantoes/${plantaoId}`),
                axios.get(`${import.meta.env.VITE_API_URL}/plantoes/${plantaoId}/candidaturas`)
            ]);
            
            setPlantao(plantaoRes.data);
            setCandidaturas(candidaturasRes.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar detalhes do plantão:", err);
            setError("Não foi possível carregar os dados. O plantão pode não existir.");
        } finally {
            setLoading(false); // Garante que o loading principal termine
        }
    }, [plantaoId]);

    // Efeito para buscar os dados na montagem do componente
    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    // --- Event Handlers ---
    const handleAprovar = async (profissionalId) => {
        setIsApproving(profissionalId); // Inicia o loading para este candidato
        await toast.promise(
            axios.post(`${import.meta.env.VITE_API_URL}/plantoes/${plantaoId}/aprovar-candidato`, {
                profissionalId: profissionalId,
            }),
            {
                loading: 'A processar aprovação...',
                success: () => {
                    fetchData(); // Re-busca os dados para atualizar a página
                    return 'Profissional aprovado com sucesso!';
                },
                error: 'Não foi possível aprovar o candidato.',
            }
        );
        setIsApproving(null); // Finaliza o loading
    };

    // --- Renderização Condicional ---
    if (loading) return <div className="p-8 text-center">A carregar detalhes do plantão...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!plantao) return <div className="p-8 text-center">Plantão não encontrado.</div>;

    // --- Renderização Principal ---
    return (
        <div>
            <button onClick={() => navigate('/plantoes')} className="mb-4 text-teal-600 hover:underline">
                &larr; Voltar para todos os plantões
            </button>

            <PlantaoInfo plantao={plantao} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Candidatos ({candidaturas.length})</h2>
                <div className="space-y-4">
                    {candidaturas.length > 0 ? (
                        candidaturas.map(candidato => (
                            <CandidatoItem
                                key={candidato.id}
                                candidato={candidato}
                                plantaoStatus={plantao.status}
                                onAprovar={handleAprovar}
                                isApproving={isApproving}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Ainda não há candidatos para este plantão.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalhePlantaoPage;