import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
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
              <MenuItem onClick={() => handleNavigation('/')}>Dashboard</MenuItem>
              <MenuItem onClick={() => handleNavigation('/imoveis')}>Imóveis</MenuItem>
              <MenuItem onClick={() => handleNavigation('/financeiro')}>Financeiro</MenuItem>
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
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/imoveis')}>
              <ListItemText primary="Imóveis" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/financeiro')}>
              <ListItemText primary="Financeiro" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
}