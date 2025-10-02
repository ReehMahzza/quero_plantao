// src/pages/PlantoesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Importações do Material-UI
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';

// Nossas outras importações
import Modal from '../components/Modal.jsx';
import FormularioPlantao from '../components/FormularioPlantao.jsx';

function PlantoesPage() {
    const navigate = useNavigate();
    const [plantoes, setPlantoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchAllPlantoes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/plantoes`);
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

          await axios.post(`${import.meta.env.VITE_API_URL}/plantoes`, dadosFormatados);

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

    // Componente de Chip de Status do MUI
    const StatusChip = ({ status }) => {
        const colorMap = {
            open: 'primary',
            filled: 'success',
            closed: 'default',
        };
        return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
    };

    const formatDate = (timestamp) => {
      if (!timestamp || !timestamp.seconds) return 'N/A';
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('pt-BR');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Gestão de Plantões
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Publicar Novo Plantão
                </Button>
            </Box>

            {/* Área de Filtros (ainda estática, mas com componentes MUI) */}
            <Paper sx={{ p: 2, mb: 3 }}>
                {/* ... (aqui podemos recriar os filtros com componentes MUI no futuro) ... */}
                Filtros aparecerão aqui.
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Profissional</TableCell>
                            <TableCell>Cargo</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: 'red' }}>{error}</TableCell>
                            </TableRow>
                        ) : (
                            plantoes.map((plantao) => (
                                <TableRow key={plantao.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/plantoes/${plantao.id}`)}>
                                    <TableCell>{formatDate(plantao.dataInicio)}</TableCell>
                                    <TableCell>{plantao.profissionalInfo?.nomeCompleto || '---'}</TableCell>
                                    <TableCell>{plantao.titulo}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plantao.valorOferecido)}</TableCell>
                                    <TableCell><StatusChip status={plantao.status} /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormularioPlantao
                    onCancel={() => setIsModalOpen(false)}
                    onSave={handleSavePlantao}
                />
            </Modal>
        </Box>
    );
}

export default PlantoesPage;