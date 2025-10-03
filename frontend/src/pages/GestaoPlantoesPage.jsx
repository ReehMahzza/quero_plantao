// src/pages/GestaoPlantoesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

// Importações dos componentes do Material-UI
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from '@mui/material';

// Importações da DataGrid
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';

// Importações dos ícones
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Componente para o painel das abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const initialPlantaoState = {
  paciente: '',
  endereco: { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' },
  dataHoraInicio: '',
  dataHoraFim: '',
  tipoProfissional: 'Enfermeiro',
  valor: '',
  observacoes: '',
};

function GestaoPlantoesPage() {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [plantoes, setPlantoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [novoPlantao, setNovoPlantao] = useState(initialPlantaoState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlantaoId, setSelectedPlantaoId] = useState(null);
  const openMenu = Boolean(anchorEl);

  const fetchPlantoes = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/plantoes');
      const plantoesComId = response.data.map(p => ({
        ...p,
        id: p.id || p._id 
      }));
      setPlantoes(plantoesComId);
    } catch (error) {
      toast.error('Não foi possível carregar os plantões.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantoes();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNovoPlantao(initialPlantaoState);
  }

  const handleMenuClick = (event, plantaoId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlantaoId(plantaoId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlantaoId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setNovoPlantao(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value }}));
    } else {
        setNovoPlantao(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async () => {
    const payload = {
        ...novoPlantao,
        idInstituicao: currentUser.uid,
    };

    const creationPromise = apiClient.post('/plantoes', payload);

    await toast.promise(creationPromise, {
        loading: 'Publicando novo plantão...',
        success: () => {
            fetchPlantoes();
            handleCloseModal();
            return 'Plantão publicado com sucesso!';
        },
        error: 'Não foi possível publicar o plantão.'
    });
  }

  const columns = [
    { 
      field: 'paciente', 
      headerName: 'Paciente', 
      flex: 1.5,
      // --- CORREÇÃO APLICADA AQUI ---
      // Lógica de tradução movida para renderCell para maior robustez.
      renderCell: (params) => {
        if (!params || !params.row) return '';
        return params.row.paciente || params.row.titulo || 'Não informado';
      }
    },
    { 
        field: 'endereco', 
        headerName: 'Endereço', 
        flex: 2,
        renderCell: (params) => {
            if (!params || !params.row) return '';
            const { endereco, logradouro, numero, cidade } = params.row;
            if (endereco) {
                return `${endereco.rua}, ${endereco.numero} - ${endereco.cidade}`;
            }
            if (logradouro && cidade) {
                return `${logradouro}, ${numero} - ${cidade}`;
            }
            return 'Endereço não informado';
        }
    },
    { 
        field: 'dataHora', // O field pode ser genérico pois a lógica está no renderCell
        headerName: 'Data e Hora', 
        flex: 2,
        renderCell: (params) => {
            try {
                if (!params || !params.row) return '';
                const inicioTimestamp = params.row.dataHoraInicio || params.row.dataInicio;
                const fimTimestamp = params.row.dataHoraFim || params.row.dataFim;

                if (!inicioTimestamp?.seconds || !fimTimestamp?.seconds) {
                    return 'Data indisponível';
                }
                const inicio = new Date(inicioTimestamp.seconds * 1000);
                const fim = new Date(fimTimestamp.seconds * 1000);
                return `${format(inicio, 'dd/MM/yyyy HH:mm')} - ${format(fim, 'HH:mm')}`;
            } catch (e) {
                return 'Data inválida';
            }
        }
    },
    { 
        field: 'candidatos', 
        headerName: 'Candidatos', 
        flex: 1,
        renderCell: (params) => {
          if (!params || !params.row) return null;
          return (
            <Button component={RouterLink} to={`/plantoes/${params.row.id}/candidaturas`} size="small">
                0 Candidatos
            </Button>
          );
        }
    },
    { 
        field: 'status', 
        headerName: 'Status', 
        flex: 1,
        renderCell: (params) => {
            if (!params) return null;
            const status = String(params.value || '').toLowerCase();
            let color = 'default';
            let label = params.value || 'N/A';

            if (status === 'aberta' || status === 'open') {
              color = 'success';
              label = 'Aberta';
            }
            if (status === 'preenchida' || status === 'filled') {
              color = 'primary';
              label = 'Preenchida';
            }
            if (status === 'cancelada' || status === 'closed') {
              color = 'error';
              label = 'Cancelada'
            }
            return <Chip label={label} color={color} size="small" />;
        }
    },
    {
        field: 'acoes',
        headerName: 'Ações',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!params || !params.row) return null;
          return (
            <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                <MoreVertIcon />
            </IconButton>
          );
        }
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Gestão de Vagas" />
          <Tab label="Monitoramento em Execução" />
        </Tabs>
      </Box>

      {/* Painel 1: Gestão de Vagas */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Vagas Publicadas</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Publicar Novo Plantão
            </Button>
        </Box>
        <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={plantoes}
                columns={columns}
                loading={loading}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
        </Paper>
      </TabPanel>

      {/* Painel 2: Monitoramento */}
      <TabPanel value={tabValue} index={1}>
        <Typography>Funcionalidade em desenvolvimento.</Typography>
      </TabPanel>

      {/* Menu de Ações da Tabela */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cancelar</MenuItem>
      </Menu>

      {/* Modal de Criação de Plantão */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Publicar Novo Plantão</DialogTitle>
        <DialogContent>
            <TextField name="paciente" label="Nome do Paciente" fullWidth margin="normal" value={novoPlantao.paciente} onChange={handleFormChange} />
            <Typography variant="subtitle1" sx={{mt: 2, mb: 1}}>Endereço do Atendimento</Typography>
            <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                <TextField name="endereco.cep" label="CEP" sx={{flex: '1 1 30%'}} value={novoPlantao.endereco.cep} onChange={handleFormChange}/>
                <TextField name="endereco.rua" label="Rua" sx={{flex: '1 1 65%'}} value={novoPlantao.endereco.rua} onChange={handleFormChange}/>
                <TextField name="endereco.numero" label="Número" sx={{flex: '1 1 20%'}} value={novoPlantao.endereco.numero} onChange={handleFormChange}/>
                <TextField name="endereco.bairro" label="Bairro" sx={{flex: '1 1 40%'}} value={novoPlantao.endereco.bairro} onChange={handleFormChange}/>
                <TextField name="endereco.cidade" label="Cidade" sx={{flex: '1 1 40%'}} value={novoPlantao.endereco.cidade} onChange={handleFormChange}/>
                <TextField name="endereco.estado" label="Estado" sx={{flex: '1 1 20%'}} value={novoPlantao.endereco.estado} onChange={handleFormChange}/>
            </Box>
             <Typography variant="subtitle1" sx={{mt: 3, mb: 1}}>Detalhes do Plantão</Typography>
             <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                <TextField name="dataHoraInicio" label="Início do Plantão" type="datetime-local" InputLabelProps={{ shrink: true }} sx={{flex: '1 1 48%'}} value={novoPlantao.dataHoraInicio} onChange={handleFormChange}/>
                <TextField name="dataHoraFim" label="Fim do Plantão" type="datetime-local" InputLabelProps={{ shrink: true }} sx={{flex: '1 1 48%'}} value={novoPlantao.dataHoraFim} onChange={handleFormChange}/>
                <FormControl fullWidth sx={{flex: '1 1 48%'}}>
                    <InputLabel>Tipo de Profissional</InputLabel>
                    <Select name="tipoProfissional" label="Tipo de Profissional" value={novoPlantao.tipoProfissional} onChange={handleFormChange}>
                        <MenuItem value="Enfermeiro">Enfermeiro</MenuItem>
                        <MenuItem value="Técnico">Técnico de Enfermagem</MenuItem>
                        <MenuItem value="Auxiliar">Auxiliar de Enfermagem</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="valor" label="Valor do Pagamento (R$)" type="number" sx={{flex: '1 1 48%'}} value={novoPlantao.valor} onChange={handleFormChange}/>
             </Box>
            <TextField name="observacoes" label="Observações Adicionais" fullWidth margin="normal" multiline rows={3} value={novoPlantao.observacoes} onChange={handleFormChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Publicar Plantão</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GestaoPlantoesPage;

