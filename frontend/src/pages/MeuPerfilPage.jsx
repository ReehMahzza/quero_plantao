import React, { useState, useEffect } from 'react';
import apiClient from '../api'; 
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // NOVO: Importa o hook de autenticação

// Importações dos componentes do Material-UI
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

const initialProfileState = {
  nomeCompleto: '',
  email: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  endereco: {
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  },
  coren: {
    tipo: '',
    numero: '',
    estado: '',
  },
  anosDeExperiencia: '',
  especialidades: [],
  resumoProfissional: '',
  dadosBancarios: {
    banco: '',
    agencia: '',
    conta: '',
  },
};

function MeuPerfilPage() {
  const [profileData, setProfileData] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refreshUserProfile } = useAuth(); // NOVO: Obtém a função de atualização do contexto

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiClient.get('/profissionais/meu-perfil');
        setProfileData(prevData => ({
          ...prevData,
          ...response.data,
          coren: {
            ...prevData.coren,
            ...(response.data.coren || {}),
          },
          endereco: {
            ...prevData.endereco,
            ...(response.data.endereco || {}),
          },
          dadosBancarios: {
            ...prevData.dadosBancarios,
            ...(response.data.dadosBancarios || {}),
          },
        }));
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        toast.error("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setProfileData({ ...profileData, [name]: value });
    } else {
      setProfileData(prevData => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = profileData;

    const updatePromise = apiClient.put('/profissionais/meu-perfil', payload);

    await toast.promise(updatePromise, {
      loading: 'A salvar as alterações...',
      // NOVO: A lógica de sucesso agora é uma função para invocar a atualização
      success: async () => {
        await refreshUserProfile(); // Recarrega os dados do perfil em toda a aplicação
        return 'Perfil salvo com sucesso!'; // Retorna a mensagem para o toast
      },
      error: (err) => err.response?.data?.message || 'Não foi possível salvar as alterações.',
    });

    setSaving(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Seção de Dados Pessoais */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField name="nomeCompleto" label="Nome Completo" value={profileData.nomeCompleto} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 48%' }} />
            <TextField name="email" label="E-mail" value={profileData.email} variant="outlined" sx={{ flex: '1 1 48%' }} disabled />
            <TextField name="cpf" label="CPF" value={profileData.cpf} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 30%' }} />
            <TextField name="dataNascimento" label="Data de Nascimento" type="date" InputLabelProps={{ shrink: true }} value={profileData.dataNascimento || ''} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 30%' }} />
              <FormControl variant="outlined" sx={{ flex: '1 1 30%' }}>
                  <InputLabel id="sexo-label">Sexo</InputLabel>
                  <Select labelId="sexo-label" name="sexo" value={profileData.sexo} onChange={handleChange} label="Sexo">
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Feminino">Feminino</MenuItem>
                      <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
              </FormControl>
            <TextField name="telefone" label="Telefone" value={profileData.telefone} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 30%' }} />
          </Box>
        </Paper>

        {/* Seção de Endereço */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Endereço</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField name="endereco.cep" label="CEP" value={profileData.endereco.cep} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 20%' }} />
                <TextField name="endereco.rua" label="Rua" value={profileData.endereco.rua} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 50%' }} />
                <TextField name="endereco.numero" label="Número" value={profileData.endereco.numero} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 20%' }} />
                <TextField name="endereco.complemento" label="Complemento" value={profileData.endereco.complemento} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 20%' }} />
                <TextField name="endereco.bairro" label="Bairro" value={profileData.endereco.bairro} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 48%' }} />
                <TextField name="endereco.cidade" label="Cidade" value={profileData.endereco.cidade} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 48%' }} />
                <TextField name="endereco.estado" label="Estado (UF)" value={profileData.endereco.estado} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 20%' }} />
            </Box>
        </Paper>
        
        {/* Seção de Credenciais Profissionais */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Credenciais Profissionais</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControl variant="outlined" sx={{ flex: '1 1 30%' }}>
                    <InputLabel id="coren-tipo-label">Tipo de COREN</InputLabel>
                    <Select labelId="coren-tipo-label" name="coren.tipo" value={profileData.coren.tipo} onChange={handleChange} label="Tipo de COREN">
                        <MenuItem value="Técnico">Técnico</MenuItem>
                        <MenuItem value="Auxiliar">Auxiliar</MenuItem>
                        <MenuItem value="Enfermeiro">Enfermeiro</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="coren.numero" label="Número do COREN" value={profileData.coren.numero} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 30%' }} />
                <TextField name="coren.estado" label="Estado do COREN (UF)" value={profileData.coren.estado} onChange={handleChange} variant="outlined" sx={{ flex: '1 1 30%' }} />
            </Box>
        </Paper>
        
         {/* Seção de Informações de Carreira */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Informações de Carreira</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField name="anosDeExperiencia" label="Anos de Experiência" type="number" value={profileData.anosDeExperiencia} onChange={handleChange} variant="outlined" fullWidth />
                <TextField name="resumoProfissional" label="Resumo Profissional" value={profileData.resumoProfissional} onChange={handleChange} variant="outlined" fullWidth multiline rows={4} sx={{mt: 2}}/>
            </Box>
        </Paper>

        {/* Seção de Dados Bancários (Placeholder) */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Dados Bancários (Em Breve)</Typography>
          <Typography variant="body2" color="text.secondary">Esta seção será habilitada futuramente para pagamentos.</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, filter: 'blur(2px)', pointerEvents: 'none' }}>
              <TextField name="dadosBancarios.banco" label="Banco" variant="outlined" sx={{ flex: '1 1 30%' }} disabled />
              <TextField name="dadosBancarios.agencia" label="Agência" variant="outlined" sx={{ flex: '1 1 30%' }} disabled />
              <TextField name="dadosBancarios.conta" label="Conta com dígito" variant="outlined" sx={{ flex: '1 1 30%' }} disabled />
           </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 4 }}>
          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? 'A Salvar...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default MeuPerfilPage;