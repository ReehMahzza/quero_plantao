// src/pages/PerfilProfissionalPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { toast } from 'react-hot-toast';

// Importações dos componentes do Material-UI
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PerfilProfissionalPage() {
  const { profissionalId } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/profissionais/${profissionalId}`);
        setPerfil(response.data);
      } catch (err) {
        console.error("Erro ao carregar perfil do profissional:", err);
        setError("Não foi possível carregar o perfil. Tente novamente mais tarde.");
        toast.error("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [profissionalId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Voltar</Button>
      </Container>
    );
  }

  if (!perfil) return null;

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Coluna Esquerda (Resumo) */}
          <Box
            sx={{
              flex: '0 0 250px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 150,
                height: 150,
                fontSize: '4rem',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              {perfil.nomeCompleto ? perfil.nomeCompleto.charAt(0) : '?'}
            </Avatar>
            <Typography variant="h4" component="h1">
              {perfil.nomeCompleto}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {perfil.coren?.tipo || 'Profissional da Saúde'}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          
          {/* Coluna Direita (Detalhes) */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Resumo Profissional
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {perfil.resumoProfissional || 'Nenhum resumo profissional fornecido.'}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Especialidades
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {perfil.especialidades && perfil.especialidades.length > 0 ? (
                perfil.especialidades.map((esp, index) => (
                  <Chip key={index} label={esp} color="secondary" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma especialidade informada.
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Experiência
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {perfil.anosDeExperiencia !== undefined ? `${perfil.anosDeExperiencia} anos de experiência` : 'Informação não disponível.'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default PerfilProfissionalPage;
