import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import TaskIcon from '@mui/icons-material/Task'; // Ícone para Tarefas
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

export default function CustomAppBar({ userName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    router.push(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <>
      {/* AppBar para Mobile */}
      {isMobile && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Bem-vindo, {userName || 'Usuário'}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleNavigation('/')}>
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/imoveis')}>
                <HomeWorkIcon sx={{ mr: 1 }} />
                Imóveis
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/financeiro')}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                Financeiro
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/pos-arrematacao')}>
                <GavelIcon sx={{ mr: 1 }} />
                Pós Arrematação
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/tarefas')}>
                <TaskIcon sx={{ mr: 1 }} />
                Tarefas
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar para Desktop */}
      {!isMobile && (
        <Drawer variant="permanent" open>
          <List sx={{ width: 250, mt: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Bem-vindo, {userName || 'Usuário'}
            </Typography>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/imoveis')}>
              <ListItemIcon>
                <HomeWorkIcon />
              </ListItemIcon>
              <ListItemText primary="Imóveis" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/financeiro')}>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Financeiro" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/pos-arrematacao')}>
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText primary="Pós Arrematação" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/tarefas')}>
              <ListItemIcon>
                <TaskIcon />
              </ListItemIcon>
              <ListItemText primary="Tarefas" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
}