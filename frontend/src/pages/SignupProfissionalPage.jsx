import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Importações dos componentes do Material-UI
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function SignupProfissionalPage() {
  // Estado simplificado para o cadastro mínimo
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload ajustado para enviar apenas os dados mínimos
    const payload = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      cpf: formData.cpf,
      password: formData.password,
    };

    const signupPromise = axios.post(`${import.meta.env.VITE_API_URL}/auth/signup/profissional`, payload);

    await toast.promise(signupPromise, {
      loading: 'A criar a sua conta...',
      success: 'Registo realizado com sucesso! Faça o login para continuar.',
      error: (err) => {
        return err.response?.data?.message || "Não foi possível concluir o registo.";
      },
    });

    // A lógica de navegação permanece a mesma após o sucesso
    signupPromise.then(() => navigate('/login')).catch(() => {});
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastro de Profissional
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nomeCompleto"
            label="Nome Completo"
            name="nomeCompleto"
            autoComplete="name"
            autoFocus
            value={formData.nomeCompleto}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="cpf"
            label="CPF"
            name="cpf"
            autoComplete="off" // Desativa o autocomplete para dados sensíveis
            value={formData.cpf}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'A finalizar...' : 'Finalizar Cadastro'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Link component={RouterLink} to="/signup" variant="body2">
              Voltar
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupProfissionalPage;