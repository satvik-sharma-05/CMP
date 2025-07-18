import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { AccountCircle, Dashboard, People } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; // adjust relative path correctly
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Box
            component="img"
            src={logo}
            alt="CMP Logo"
            onClick={() => navigate('/dashboard')}
            sx={{
              width: 50,
              height: 50,
              marginLeft: 1,
              marginRight: 6,
              borderRadius: '50%',
              objectFit: 'cover',
              overflow: 'hidden',
              border: '2px solid #ccc',
              cursor: 'pointer',
              transform: 'scale(2)',
            }}
          />
          Colleague Management Portal
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate('/dashboard')}
          sx={{
            backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
        >
          Dashboard
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate('/catalogue')}
          sx={{
            backgroundColor: isActive('/catalogue') ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
        >
          Colleague Catalogue
        </Button>
        {user && (
          <Box sx={{ ml: 2 }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenu}
            >
              <Avatar>{user.username ? user.username[0].toUpperCase() : ''}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>{user.username}</MenuItem>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;