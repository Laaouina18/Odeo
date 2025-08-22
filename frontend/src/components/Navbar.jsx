import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { getUserFromStorage, isAuthenticated, clearUserStorage } from '../utils/storage';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = getUserFromStorage();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    clearUserStorage();
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
        boxShadow: '0 4px 20px rgba(129, 39, 85, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 800,
            letterSpacing: 1,
            background: 'linear-gradient(45deg, #ffffff, #f8f9fa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          🏛️ ODEO
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            🏠 Accueil
          </Button>
          
          {authenticated && (
            <>
              {user?.role === 'client' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/client/dashboard"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  📊 Mon Dashboard
                </Button>
              )}
              
              {user?.role === 'agency' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/agency/dashboard"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  🏢 Dashboard Agence
                </Button>
              )}
              
              {user?.role === 'admin' && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin/dashboard"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  ⚙️ Dashboard Admin
                </Button>
              )}
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/client-space"
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                👤 Mon Espace
              </Button>
            </>
          )}
          
          {!authenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                🔑 Connexion
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                variant="outlined"
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                📝 Inscription
              </Button>
            </>
          ) : (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  opacity: 0.9
                }}
              >
                Bonjour {user?.name}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                🚪 Déconnexion
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;