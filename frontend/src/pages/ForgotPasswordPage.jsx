import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
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

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passwordResetPromise = sendPasswordResetEmail(auth, email);

    await toast.promise(passwordResetPromise, {
      loading: 'A enviar o e-mail...',
      success: 'Link enviado! Verifique a sua caixa de entrada.',
      error: 'Ocorreu um erro. Verifique o e-mail e tente novamente.',
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
          Recuperar Senha
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 1 }}>
          Por favor, insira o seu endereço de e-mail. Enviaremos um link para redefinir a sua senha.
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'A Enviar...' : 'Enviar Link de Recuperação'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Voltar para o Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;
