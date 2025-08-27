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
  Avatar,
  Badge,
  Chip,
  Fade,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Apps as AppsIcon
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Effet de scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    ...(authenticated ? [
      ...(user?.role === 'client' ? [
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

  // Logo moderne avec icône
  const LogoComponent = () => (
    <Box 
      component={Link}
      to="/"
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      {/* Icône moderne */}
      <Box
        sx={{
          width: 42,
          height: 42,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          }
        }}
      >
        <AppsIcon sx={{ color: 'white', fontSize: '1.4rem', fontWeight: 'bold' }} />
      </Box>
      <Typography 
        variant={isMobile ? "h6" : "h5"}
        sx={{ 
          fontWeight: 900,
          letterSpacing: 2,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
        }}
      >
        ODEO
      </Typography>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: isScrolled 
            ? '1px solid rgba(0, 0, 0, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 2, md: 4 }, 
          height: 70,
          minHeight: '70px !important'
        }}>
          {/* Logo */}
          <LogoComponent />

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Desktop */}
          {!isMobile ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  color: '#1e3c72',
                  minHeight: 44,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: -1,
                  },
                  '&:hover': {
                    color: 'white',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
              >
                Accueil
              </Button>
              
              {authenticated ? (
                <>
                  {user?.role === 'client' && (
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/client-space"
                      startIcon={<PersonIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        color: '#1e3c72',
                        minHeight: 44,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: -1,
                        },
                        '&:hover': {
                          color: 'white',
                          '&::before': {
                            opacity: 1,
                          }
                        }
                      }}
                    >
                      Mon Espace
                    </Button>
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
                        px: 3,
                        py: 1.5,
                        color: '#1e3c72',
                        minHeight: 44,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: -1,
                        },
                        '&:hover': {
                          color: 'white',
                          '&::before': {
                            opacity: 1,
                          }
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
                        px: 3,
                        py: 1.5,
                        color: '#1e3c72',
                        minHeight: 44,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: -1,
                        },
                        '&:hover': {
                          color: 'white',
                          '&::before': {
                            opacity: 1,
                          }
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}
                  
                  {/* Notifications */}
                  <IconButton
                    sx={{
                      mx: 1,
                      color: '#1e3c72',
                      width: 44,
                      height: 44,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        color: 'white',
                        '&::before': {
                          opacity: 1,
                        }
                      }
                    }}
                  >
                    <Badge 
                      badgeContent={3} 
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#ff4757',
                          color: 'white',
                          fontWeight: 700
                        }
                      }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  
                  {/* Profil utilisateur */}
                  <Button
                    endIcon={<ArrowDownIcon />}
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      ml: 1,
                      color: '#1e3c72',
                      border: '2px solid #e1e8ed',
                      minHeight: 44,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        color: 'white',
                        borderColor: '#1e3c72',
                        '&::before': {
                          opacity: 1,
                        }
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        mr: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '0.8rem',
                        fontWeight: 800
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ textAlign: 'left', display: { xs: 'none', lg: 'block' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                        {user?.role}
                      </Typography>
                    </Box>
                  </Button>
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
                      px: 3,
                      py: 1.5,
                      color: '#1e3c72',
                      minHeight: 44,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        color: 'white',
                        '&::before': {
                          opacity: 1,
                        }
                      }
                    }}
                  >
                    Connexion
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      px: 3,
                      py: 1.5,
                      ml: 1,
                      color: 'white',
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      minHeight: 44,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        '&::before': {
                          opacity: 1,
                        }
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
              sx={{ 
                ml: 1,
                color: '#1e3c72',
                width: 44,
                height: 44,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
                '&:hover': {
                  color: 'white',
                  '&::before': {
                    opacity: 1,
                  }
                }
              }}
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
        elevation={0}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 260,
            border: '2px solid #e1e8ed',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          px: 3, 
          py: 3, 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.2rem',
                fontWeight: 800,
                border: '3px solid rgba(255,255,255,0.2)'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user?.email}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {user?.role}
              </Box>
            </Box>
          </Box>
        </Box>
        
        <MenuItem 
          onClick={handleProfileMenuClose}
          sx={{ 
            py: 2, 
            px: 3,
            '&:hover': {
              backgroundColor: '#f8f9fa'
            }
          }}
        >
          <SettingsIcon sx={{ mr: 2, color: '#1e3c72' }} />
          <Typography fontWeight={600} color="#1e3c72">Paramètres</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 2, 
            px: 3,
            '&:hover': {
              backgroundColor: 'rgba(255, 77, 79, 0.08)'
            }
          }}
        >
          <LogoutIcon sx={{ mr: 2, color: '#ff4d4f' }} />
          <Typography fontWeight={600} color="#ff4d4f">Déconnexion</Typography>
        </MenuItem>
      </Menu>

      {/* Drawer Mobile */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: 'white',
            borderLeft: '2px solid #e1e8ed'
          }
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }} />
        
        {/* En-tête mobile */}
        {authenticated && (
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            mb: 2
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  border: '3px solid rgba(255,255,255,0.2)'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    px: 2,
                    py: 0.5,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {user?.role}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Menu Items */}
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                py: 2,
                px: 3,
                mb: 1,
                color: '#1e3c72',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
                '&:hover': {
                  color: 'white',
                  '&::before': {
                    opacity: 1,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              />
            </ListItem>
          ))}
          
          {authenticated && (
            <>
              <Divider sx={{ my: 2 }} />
              <ListItem
                button
                onClick={() => {
                  handleLogout();
                  setMobileDrawerOpen(false);
                }}
                sx={{ 
                  py: 2,
                  px: 3,
                  color: '#ff4d4f',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: -1,
                  },
                  '&:hover': {
                    color: 'white',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Déconnexion" 
                  primaryTypographyProps={{
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Spacer pour compenser la navbar fixe */}
      <Toolbar sx={{ minHeight: '70px !important' }} />
    </>
  );
};

export default Navbar;