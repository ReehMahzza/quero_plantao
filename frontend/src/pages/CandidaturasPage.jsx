// src/pages/DetalhePlantaoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api'; // Alinhado com a nossa arquitetura de API
import { toast } from 'react-hot-toast';
import { format } from 'date-fns'; // Alinhado com a nossa biblioteca de datas

// Importações dos componentes do Material-UI
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  CircularProgress,
  Paper,
  IconButton, // Para o botão de voltar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ícone para o botão de voltar

function CandidaturasPage() {
  const { plantaoId } = useParams();
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState([]);
  const [plantao, setPlantao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // As chamadas agora usam o apiClient para autenticação
        const [plantaoResponse, candidatosResponse] = await Promise.all([
          apiClient.get(`/plantoes/${plantaoId}`),
          apiClient.get(`/plantoes/${plantaoId}/candidaturas`),
        ]);
        
        // Lê os dados do novo modelo (ex: 'paciente')
        setPlantao(plantaoResponse.data);
        setCandidatos(candidatosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados das candidaturas.");
        navigate('/gestao-plantoes'); // Rota correta para a página de gestão
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantaoId, navigate]);

  const handleApprove = async (idProfissional) => {
    // O payload agora segue o contrato do backend: 'idProfissionalAprovado'
    const approvalPromise = apiClient.post(`/plantoes/${plantaoId}/aprovar-candidato`, {
      idProfissionalAprovado: idProfissional,
    });

    await toast.promise(approvalPromise, {
      loading: 'A processar aprovação...',
      success: 'Profissional aprovado com sucesso!',
      error: (err) => err.response?.data?.message || 'Não foi possível aprovar o candidato.',
    });

    // Após o sucesso, redireciona para a página de gestão
    approvalPromise.then(() => navigate('/gestao-plantoes'));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton component={RouterLink} to="/gestao-plantoes" sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Painel de Seleção de Candidatos
        </Typography>
      </Box>

      {/* Card de Contexto do Plantão (Refatorado com Paper) */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, bgcolor: 'grey.100' }}>
        <Typography variant="h6">
          <strong>Paciente:</strong> {plantao?.paciente}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Período:</strong> {plantao ? `${format(new Date(plantao.dataHoraInicio), 'dd/MM/yyyy HH:mm')} até ${format(new Date(plantao.dataHoraFim), 'HH:mm')}` : 'N/A'}
        </Typography>
      </Paper>

      {/* Grelha de Candidatos (Refatorada com Card) */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {candidatos.length > 0 ? (
          candidatos.map((candidato) => (
            <Card key={candidato.idProfissional} sx={{ width: 320, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
                    {candidato.nomeCompleto.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{candidato.nomeCompleto}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {candidato.coren?.tipo || 'Profissional'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">
                  <strong>Experiência:</strong> {candidato.anosDeExperiencia || 'N/A'} anos
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">Ver Perfil Completo</Button>
                <Button size="small" variant="contained" onClick={() => handleApprove(candidato.idProfissional)}>
                  Aprovar para o Plantão
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography>Ainda não há candidatos para este plantão.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default CandidaturasPage;

