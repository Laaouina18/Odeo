import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Read user and role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Odeo Services
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Accueil</Button>
          <Button color="inherit" component={Link} to="/services">Services</Button>
          {/* Client-specific links */}
          {isAuthenticated && role === 'client' && (
            <>
              <Button color="inherit" component={Link} to="/client/dashboard">Mon espace</Button>
              <Button color="inherit" component={Link} to="/client/favorites">Favoris</Button>
              <Button color="inherit" component={Link} to="/client/bookings">Mes réservations</Button>
            </>
          )}
          {/* Agency-specific links */}
          {isAuthenticated && role === 'agency' && (
            <>
              <Button color="inherit" component={Link} to="/agency/dashboard">Espace Agence</Button>
              <Button color="inherit" component={Link} to="/agency/notifications">Notifications</Button>
              <Button color="inherit" component={Link} to="/agency/statistics">Statistiques</Button>
            </>
          )}
          {/* Admin-specific links */}
          {isAuthenticated && role === 'admin' && (
            <>
              <Button color="inherit" component={Link} to="/admin/dashboard">Admin</Button>
              <Button color="inherit" component={Link} to="/admin/notifications">Notifications</Button>
              <Button color="inherit" component={Link} to="/admin/statistics">Statistiques</Button>
            </>
          )}
          {/* Show login/register if not authenticated */}
          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/login">Connexion</Button>
              <Button color="inherit" component={Link} to="/register">Inscription</Button>
            </>
          )}
          {/* Show logout if authenticated */}
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
          )}
        </Box>
        {/* Show user profile info if authenticated */}
        {isAuthenticated && user && (
          <Button color="inherit" component={Link} to={`/${role}/profile`} sx={{ ml: 2 }}>
            {user.name} ({role})
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
