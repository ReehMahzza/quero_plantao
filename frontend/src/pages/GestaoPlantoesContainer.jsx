import React, { useState } from 'react';
import { Box, Tabs, Tab, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import EscalaPacientesView from '../views/EscalaPacientesView'; // << IMPORTANTE: Apontando para o futuro arquivo renomeado

// O tema que estava em GestaoPlantoesPage.jsx agora vive aqui
const theme = createTheme({
  palette: {
    primary: { main: '#1A2536' },
    secondary: { main: '#00C49A' },
    background: { default: '#F4F7F9', paper: '#FFFFFF' },
    text: { primary: '#4A5568', secondary: '#A0AEC0' },
    error: { main: '#EF4444', light: '#FEF2F2' },
    warning: { main: '#F59E0B', light: '#FFFBEB' },
    info: { main: '#3B82F6', light: '#EFF6FF' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightBold: 700,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #E2E8F0' },
      },
    },
  },
});

function GestaoPlantoesContainer() {
  const [abaAtiva, setAbaAtiva] = useState('escala');

  const handleChangeAba = (event, newValue) => {
    setAbaAtiva(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs value={abaAtiva} onChange={handleChangeAba} aria-label="Abas de gestão de plantões">
            <Tab label="Gestão de Escala" value="escala" />
            <Tab label="Monitoramento em Tempo Real" value="monitoramento" />
          </Tabs>
        </Box>

        {/* Renderização Condicional do Conteúdo da Aba */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {abaAtiva === 'escala' && <EscalaPacientesView />}
          {abaAtiva === 'monitoramento' && (
            <Box sx={{ p: 3 }}>
              <h2>Monitoramento em Tempo Real (Em desenvolvimento)</h2>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default GestaoPlantoesContainer;
