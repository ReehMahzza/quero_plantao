// src/pages/SignupPage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Importações dos componentes do Material-UI
import {
  Avatar,
  Button,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function SignupPage() {
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
          Crie sua Conta
        </Typography>

        <Typography variant="h6" align="center" sx={{ mt: 4, mb: 4, fontWeight: 'normal' }}>
          Como você gostaria de usar a Conecta Care?
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Button
            component={RouterLink}
            to="/signup/profissional"
            fullWidth
            variant="outlined"
            size="large"
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            Sou Profissional da Saúde
          </Button>
          <Button
            component={RouterLink}
            to="/signup/instituicao"
            fullWidth
            variant="outlined"
            size="large"
            sx={{ mt: 2, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            Represento uma Instituição
          </Button>
        </Box>

        {/* --- CÓDIGO CORRIGIDO AQUI --- */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid> {/* A propriedade 'item' foi removida */}
            <Link component={RouterLink} to="/login" variant="body2">
              Já tem uma conta? Faça o login
            </Link>
          </Grid>
        </Grid>

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

export default SignupPage;
