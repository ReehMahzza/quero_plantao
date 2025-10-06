// src/components/Sidebar.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importações dos componentes do Material-UI
import {
  Drawer as MuiDrawer,
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
  IconButton,
  styled,
  useTheme,
} from '@mui/material';

// Importações dos ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function Sidebar({ open, handleDrawerOpen, handleDrawerClose }) {
  const theme = useTheme();
  const { logout, userProfile } = useAuth();

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 'bold', color: 'common.white', width: '100%', textAlign: 'center', opacity: open ? 1 : 0 }}>
          Conecta Care
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={RouterLink}
            to="/gestao-plantoes"
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={RouterLink}
            to="/gestao-plantoes"
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Plantões" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={RouterLink}
            to="/meu-perfil"
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Meu Perfil" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={open} sx={{
            '& .MuiDrawer-paper': {
              bgcolor: 'primary.main',
              color: 'common.white',
            },
        }}>
        <DrawerHeader>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen} sx={{color: 'common.white'}}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {drawerContent}
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2, textAlign: 'center', display: open ? 'block' : 'none' }}>
            {userProfile?.statusDoPerfil === 'pendente' && (
                <Chip label="Perfil Pendente" color="warning" size="small" />
            )}
            {userProfile?.statusDoPerfil === 'ativo' && (
                <Chip label="Perfil Ativo" color="success" size="small" />
            )}
            </Box>

            <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                onClick={logout}
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
                >
                <ListItemIcon
                    sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'inherit'
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            </List>
        </Box>
        </Drawer>
    </Box>
  );
}

export default Sidebar;