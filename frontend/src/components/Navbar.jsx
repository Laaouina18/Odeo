import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { getUserFromStorage, isAuthenticated, clearUserStorage } from '../utils/storage';
import apiFetch from '../api/apiFetch';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const user = getUserFromStorage();
  const authenticated = isAuthenticated();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleLogout = () => {
    clearUserStorage();
    dispatch(logout());
    navigate('/');
    setAnchorEl(null);
    setMobileDrawerOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Recherche en temps réel
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      try {
        const response = await apiFetch(`/services/search?q=${encodeURIComponent(query)}`);
        setSearchResults(response.data || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    ...(authenticated ? [
      ...(user?.role === 'client' ? [
        { text: 'Mon Dashboard', icon: <DashboardIcon />, path: '/client/dashboard' },
        { text: 'Mon Espace', icon: <PersonIcon />, path: '/client-space' }
      ] : []),
      ...(user?.role === 'agency' ? [
        { text: 'Dashboard Agence', icon: <BusinessIcon />, path: '/agency/dashboard' }
      ] : []),
      ...(user?.role === 'admin' ? [
        { text: 'Dashboard Admin', icon: <AdminIcon />, path: '/admin/dashboard' }
      ] : [])
    ] : [
      { text: 'Connexion', icon: <LoginIcon />, path: '/login' },
      { text: 'Inscription', icon: <PersonAddIcon />, path: '/register' }
    ])
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.9) 100%)',
          boxShadow: '0 4px 20px rgba(129, 39, 85, 0.3)',
          backdropFilter: 'blur(20px)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
          {/* Logo */}
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 0,
              mr: 3,
              fontWeight: 800,
              letterSpacing: 1.2,
              background: 'linear-gradient(45deg, #ffffff, #f8f9fa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            🏛️ ODEO
          </Typography>

          {/* Barre de recherche - Desktop */}
          {!isMobile && (
            <Box sx={{ position: 'relative', flexGrow: 1, maxWidth: 400, mx: 3 }}>
              <TextField
                size="small"
                placeholder="Rechercher des services..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(129, 39, 85, 0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowSearchResults(false);
                      }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  },
                }}
              />
              
              {/* Résultats de recherche */}
              {showSearchResults && searchResults.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: 300,
                    overflow: 'auto',
                    mt: 1
                  }}
                >
                  {searchResults.slice(0, 5).map((service) => (
                    <Box
                      key={service.id}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(129, 39, 85, 0.05)'
                        }
                      }}
                      onMouseDown={() => handleSearchResultClick(service.id)}
                    >
                      <Typography variant="subtitle2" color="rgb(129, 39, 85)" fontWeight={600}>
                        {service.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.description?.substring(0, 80)}...
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          {/* Navigation Desktop */}
          {!isMobile ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Accueil
              </Button>
              
              {authenticated ? (
                <>
                  {user?.role === 'client' && (
                    <>
                      <Button 
                        color="inherit" 
                        component={Link} 
                        to="/client/dashboard"
                        startIcon={<DashboardIcon />}
                        sx={{ 
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          px: 2,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button 
                        color="inherit" 
                        component={Link} 
                        to="/client-space"
                        startIcon={<PersonIcon />}
                        sx={{ 
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          px: 2,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Mon Espace
                      </Button>
                    </>
                  )}
                  
                  {user?.role === 'agency' && (
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/agency/dashboard"
                      startIcon={<BusinessIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        px: 2,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Dashboard Agence
                    </Button>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/admin/dashboard"
                      startIcon={<AdminIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        px: 2,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}
                  
                  {/* Profil utilisateur */}
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      px: 2,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Connexion
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      px: 2,
                      borderRadius: 2,
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Inscription
                  </Button>
                </>
              )}
            </Box>
          ) : (
            /* Menu Mobile */
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Menu Profil Desktop */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="subtitle2" fontWeight={600} color="rgb(129, 39, 85)">
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Drawer Mobile */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <Toolbar />
        
        {/* Recherche Mobile */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher des services..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(129, 39, 85, 0.7)' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'rgba(129, 39, 85, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(129, 39, 85)',
                },
              },
            }}
          />
          
          {/* Résultats recherche mobile */}
          {searchResults.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="rgb(129, 39, 85)" sx={{ mb: 1 }}>
                Résultats de recherche:
              </Typography>
              {searchResults.slice(0, 3).map((service) => (
                <Box
                  key={service.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: 'rgba(129, 39, 85, 0.05)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(129, 39, 85, 0.1)'
                    }
                  }}
                  onClick={() => {
                    handleSearchResultClick(service.id);
                    setMobileDrawerOpen(false);
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {service.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider />
        
        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(129, 39, 85, 0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'rgb(129, 39, 85)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: 'rgb(129, 39, 85)'
                }}
              />
            </ListItem>
          ))}
          
          {authenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="rgb(129, 39, 85)">
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleLogout();
                  setMobileDrawerOpen(false);
                }}
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Spacer pour compenser la navbar fixe */}
      <Toolbar />
    </>
  );
};

export default Navbar;