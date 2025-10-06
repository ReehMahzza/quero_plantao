import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Link,
  IconButton,
  Button
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Anchor as AnchorIcon,
} from '@mui/icons-material';

// IMPORTAÇÕES DOS NOVOS COMPONENTES
import Modal from '../components/Modal'; // << IMPORTADO O COMPONENTE MODAL
import FormularioPlantao from '../components/FormularioPlantao'; // << IMPORTADO O FORMULÁRIO

// --- DADOS DE EXEMPLO (MOCK DATA) (MANTIDO) ---
const mockProfissionais = [
  { id: 'p1', nome: 'Carla Nogueira', avatar: 'CN' },
  { id: 'p2', nome: 'Fábio Bastos', avatar: 'FB' },
  { id: 'p3', nome: 'Diana Magalhães', avatar: 'DM' },
  { id: 'p4', nome: 'Diogo Lima', avatar: 'DL' },
];
const mockPacientes = ['Sra. Maria Lopes', 'Sr. Jorge Mendes', 'Sra. Alice Bastos', 'Sr. Roberto Dias'];
const mockDias = ['Segunda, 06', 'Terça, 07', 'Quarta, 08', 'Quinta, 09', 'Sexta, 10'];
const mockPlantoes = {
  'Sra. Maria Lopes': {
    'Segunda, 06': {
      diurno: { id: 'pl1', profissional: mockProfissionais[0], status: 'preenchido' },
      noturno: { id: 'pl2', status: 'aberto' },
    },
    'Terça, 07': {
      diurno: { id: 'pl3', profissional: mockProfissionais[1], status: 'fixo' },
      noturno: { id: 'pl4', profissional: mockProfissionais[3], status: 'fixo' },
    },
  },
  'Sr. Jorge Mendes': {
    'Quarta, 08': {
      diurno: { id: 'pl5', status: 'urgente' },
      noturno: { id: 'pl6', profissional: mockProfissionais[2], status: 'preenchido' },
    },
  },
};
const getPlantao = (paciente, dia, turno) => mockPlantoes[paciente]?.[dia]?.[turno];

// --- COMPONENTES DA UI (PageHeader e ShiftCard MANTIDOS) ---

const PageHeader = ({ onOpenVagaModal }) => (
    <Box component="header" sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'background.paper', flexShrink: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gestão de Escala
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Home Care - Unidade Campinas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small"><ChevronLeft /></IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>Outubro, 2025</Typography>
          <IconButton size="small"><ChevronRight /></IconButton>
        </Box>
      </Box>
      <Grid container spacing={2}>
          <Grid item xs={3}>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', border: 1, borderColor: 'grey.200'}}>
                  <Typography variant="body2" color="text.secondary">Total de Pacientes</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>124</Typography>
              </Paper>
          </Grid>
          <Grid item xs={3}>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'error.light', border: 1, borderColor: 'error.main'}}>
                  <Typography variant="body2" sx={{color: 'error.dark'}}>Vagas em Aberto</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>17</Typography>
              </Paper>
          </Grid>
          <Grid item xs={3}>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', border: 1, borderColor: 'grey.200'}}>
                  <Typography variant="body2" color="text.secondary">Plantões Ocupados</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>352</Typography>
              </Paper>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={() => onOpenVagaModal({})}>+ Publicar Nova Vaga</Button>
          </Grid>
      </Grid>
    </Box>
  );

const ShiftCard = ({ plantao, turno, dia, paciente, onOpenVagaModal }) => {
  if (!plantao) return <Box sx={{ height: 52, flex: 1 }} />; // Empty space

  const handleOpenShiftClick = () => {
    onOpenVagaModal({ paciente, dia, turno });
  };

  let content, sxProps = { p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, height: 52, fontSize: '0.75rem' };

  switch (plantao.status) {
    case 'preenchido':
      sxProps = { ...sxProps, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200' };
      content = (
        <>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold' }}>{plantao.profissional.avatar}</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{plantao.profissional.nome}</Typography>
        </>
      );
      break;

    case 'fixo':
      sxProps = { ...sxProps, bgcolor: 'info.light', border: 1, borderColor: 'info.main' };
      content = (
        <>
          <AnchorIcon sx={{ fontSize: 16, color: 'info.dark' }} />
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold' }}>{plantao.profissional.avatar}</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{plantao.profissional.nome}</Typography>
        </>
      );
      break;

    case 'aberto':
      sxProps = { ...sxProps, justifyContent: 'center', bgcolor: 'warning.light', border: '2px dashed', borderColor: 'warning.main', cursor: 'pointer', '&:hover': { bgcolor: '#FDE68A' } };
      content = <Typography variant="caption" sx={{ fontWeight: 600, color: '#92400E' }}>+ Preencher {turno}</Typography>;
      return <Box sx={sxProps} onClick={handleOpenShiftClick}>{content}</Box>;

    case 'urgente':
      sxProps = { ...sxProps, justifyContent: 'center', bgcolor: 'error.light', border: '2px dashed', borderColor: 'error.main', cursor: 'pointer', '&:hover': { bgcolor: '#FECACA' } };
      content = <Typography variant="caption" sx={{ fontWeight: 600, color: '#991B1B' }}>! URGENTE {turno}</Typography>;
      return <Box sx={sxProps} onClick={handleOpenShiftClick}>{content}</Box>;

    default:
      return <Box sx={{ height: 52, flex: 1 }} />;
  }

  return <Box sx={sxProps}>{content}</Box>;
};


function EscalaPacientesView() {
    // 1. ESTADOS PARA CONTROLAR O MODAL DE PLANTÃO
    const [isPlantaoModalOpen, setIsPlantaoModalOpen] = useState(false);
    const [isFichaModalOpen, setIsFichaModalOpen] = useState(false); // << NOVO ESTADO
    const [modalData, setModalData] = useState(null);

    // Funções de manipulação de Modais
    const handleOpenPlantaoModal = (data) => {
        setModalData(data); 
        setIsPlantaoModalOpen(true);
        console.log("Abrir Modal de Gestão/Publicação de Vaga:", data);
    };

    const handleClosePlantaoModal = () => {
        setIsPlantaoModalOpen(false);
        setModalData(null); // Limpa os dados ao fechar
    };

    const handleSavePlantao = (formData) => {
        console.log("DADOS PRONTOS PARA SEREM ENVIADOS PARA A API:", formData);
        
        // AQUI ENTRARIA A CHAMADA AXIOS/FETCH PARA SUA API NODE.JS
        // Ex: axios.post('/api/v1/plantoes', formData)
        
        // Exibindo feedback
        alert(`Plantão "${formData.titulo}" salvo com sucesso!`); 

        handleClosePlantaoModal(); // Fecha o modal após salvar
        // Necessário adicionar lógica para atualizar a tabela aqui
    };

    // A função de clicar no paciente agora abre o modal de aviso
    const handlePatientClick = (e, pacienteNome) => { 
        e.preventDefault();
        setModalData({ paciente: pacienteNome }); // Guarda o nome do paciente
        setIsFichaModalOpen(true); // << ABRE O MODAL DA FICHA
    };

  return (
    <>
        <Box component="main" sx={{
          width: '100%', // Define a largura para preencher o container pai
          display: 'flex',
          flexDirection: 'column',
        }}>
          <PageHeader onOpenVagaModal={handleOpenPlantaoModal} />
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'background.default' }}>
            <TableContainer component={Paper} elevation={0} sx={{bgcolor: 'transparent'}}>
              <Table stickyHeader style={{ borderSpacing: 0, borderCollapse: 'separate' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ position: 'sticky', left: 0, zIndex: 11, bgcolor: 'background.default', width: 256, minWidth: 256, borderRight: '1px solid #E2E8F0', fontWeight: '600' }}>
                      Paciente
                    </TableCell>
                    {mockDias.map(dia => (
                      <TableCell key={dia} align="center" sx={{ minWidth: 180, bgcolor: 'background.default', fontWeight: '600' }}>
                        {dia}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: 'background.paper' }}>
                  {mockPacientes.map(paciente => (
                    <TableRow key={paciente} hover>
                      <TableCell sx={{ position: 'sticky', left: 0, zIndex: 10, bgcolor: 'background.paper', borderRight: '1px solid #E2E8F0' }}>
                        <Link href="#" onClick={(e) => handlePatientClick(e, paciente)} underline="hover" sx={{fontWeight: 500}}>{paciente}</Link>
                      </TableCell>
                      {mockDias.map(dia => (
                        <TableCell key={dia} sx={{ p: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <ShiftCard 
                                plantao={getPlantao(paciente, dia, 'diurno')} 
                                turno="diurno" 
                                dia={dia}
                                paciente={paciente}
                                onOpenVagaModal={handleOpenPlantaoModal}
                            />
                            <ShiftCard 
                                plantao={getPlantao(paciente, dia, 'noturno')} 
                                turno="noturno" 
                                dia={dia}
                                paciente={paciente}
                                onOpenVagaModal={handleOpenPlantaoModal}
                            />
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* --- MODAL DE GESTÃO/PUBLICAÇÃO DE VAGA --- */}
        <Modal isOpen={isPlantaoModalOpen} onClose={handleClosePlantaoModal}>
            <FormularioPlantao 
                onCancel={handleClosePlantaoModal} 
                onSave={handleSavePlantao} 
                initialData={modalData} 
            />
        </Modal>

        {/* --- NOVO MODAL DE AVISO DA FICHA DO PACIENTE --- */}
        <Modal isOpen={isFichaModalOpen} onClose={() => setIsFichaModalOpen(false)}>
            <h2 className="text-2xl font-bold mb-4">Ficha do Paciente em Desenvolvimento</h2>
            <p className="text-gray-600">
                Atenção! Esta funcionalidade crítica (Prontuário, Histórico e Detalhes) está em desenvolvimento. 
                Em breve, você verá aqui a ficha completa do paciente ({modalData?.paciente}), integrada com o sistema.
            </p>
        </Modal>
    </>
  );
}

export default EscalaPacientesView;
