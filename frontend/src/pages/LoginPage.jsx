import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider, // Importação para o provedor do Google
  signInWithPopup     // Importação para o login via pop-up
} from 'firebase/auth';
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
import GoogleIcon from '@mui/icons-material/Google'; // Ícone do Google

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

    const loginPromise = signInWithEmailAndPassword(auth, formData.email, formData.password);

    await toast.promise(loginPromise, {
      loading: 'A autenticar...',
      success: 'Login efetuado com sucesso!',
      error: (err) => {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            return 'Email ou senha inválidos.';
          default:
            return 'Ocorreu um erro no login.';
        }
      },
    });
    
    setLoading(false);
  };

  // NOVA FUNÇÃO: Lógica para o login com Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const googleLoginPromise = signInWithPopup(auth, provider);

    await toast.promise(googleLoginPromise, {
        loading: 'A abrir o pop-up do Google...',
        success: 'Login com Google efetuado com sucesso!',
        error: 'Não foi possível autenticar com o Google.',
    });

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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
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
            autoComplete="current-password"
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
            {loading ? 'A entrar...' : 'Entrar'}
          </Button>
          
          {/* NOVO BOTÃO: Login com Google */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Continuar com o Google
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link component={RouterLink} to="#" variant="body2">
              Esqueceu sua senha?
            </Link>
            <Link component={RouterLink} to="/signup" variant="body2">
              {"Não tem uma conta? Cadastre-se"}
            </Link>
          </Box>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
        {'Copyright © '}
        <Link color="inherit" href="#">
          Conecta Care
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Container>
  );
}

export default LoginPage;