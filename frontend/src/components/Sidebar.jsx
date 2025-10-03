// src/components/Sidebar.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações dos componentes do Material-UI
import {
  Drawer,
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';

// Importações dos ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

function Sidebar() {
  const { logout, userProfile } = useAuth();

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 'bold', color: 'common.white', width: '100%', textAlign: 'center' }}>
          Conecta Care
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/gestao-plantoes">
            <ListItemIcon sx={{ color: 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/gestao-plantoes">
            <ListItemIcon sx={{ color: 'inherit' }}>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Plantões" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/meu-perfil">
            <ListItemIcon sx={{ color: 'inherit' }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Meu Perfil" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'common.white',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {drawerContent}
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ p: 2, textAlign: 'center' }}>
          {userProfile?.statusDoPerfil === 'pendente' && (
            <Chip label="Perfil Pendente" color="warning" size="small" />
          )}
          {userProfile?.statusDoPerfil === 'ativo' && (
            <Chip label="Perfil Ativo" color="success" size="small" />
          )}
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;