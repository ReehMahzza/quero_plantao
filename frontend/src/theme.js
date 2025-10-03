import { createTheme } from '@mui/material/styles';

// Criação do tema customizado para o Conecta Care
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A2536', // Azul-Marinho
    },
    secondary: {
      main: '#00C49A', // Verde-Água
    },
    background: {
      default: '#F4F7F9', // Cinza Gelo
    },
    text: {
      primary: '#4A5568',   // Cinza Escuro
    },
  },
});

