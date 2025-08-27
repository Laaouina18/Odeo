import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/authSlice';


const Register = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Palette de couleurs professionnelle
  const PRIMARY_COLOR = '#1e3c72';
  const SECONDARY_COLOR = '#2a5298';
  const VIOLET_BLUE = '#667eea';
  const VIOLET_PURPLE = '#764ba2';
  const ACCENT_RED = '#ff4d4f';

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirige vers le dashboard selon le rôle
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'agency') navigate('/agency/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agency_name: '',
    agency_email: '',
    agency_phone: '',
    agency_description: '',
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const payload = role === 'client'
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'client',
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'agency',
            agency_name: form.agency_name,
            agency_email: form.agency_email,
            agency_phone: form.agency_phone,
            agency_description: form.agency_description,
          };
      await dispatch(register(payload));
      setSuccess('Inscription réussie !');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      sx={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(248, 250, 252, 0.95) 25%,
          rgba(241, 245, 249, 0.9) 50%,
          rgba(226, 232, 240, 0.95) 100%
        )`,
        backdropFilter: 'blur(20px)',
        padding: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
          zIndex: -1,
        }
      }}
    >
      <Paper 
        elevation={24}
        className="glass-card animate-fade-in-up"
        sx={{ 
          p: 5, 
          minWidth: 480,
          maxWidth: 540,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `0 20px 60px ${PRIMARY_COLOR}15, 0 10px 30px rgba(0, 0, 0, 0.1)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE}, ${ACCENT_RED})`,
          }
        }}
      >
        <Box textAlign="center" mb={4} sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 8px 32px ${VIOLET_BLUE}30`,
            '&::before': {
              content: '"👤"',
              fontSize: '2rem',
            }
          }} />
          
          <Typography 
            variant="h3" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
              fontSize: '2.2rem'
            }}
          >
            Inscription
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Créez votre compte pour commencer
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <FormLabel 
            sx={{ 
              color: VIOLET_BLUE, 
              fontWeight: 700,
              fontSize: '1.1rem',
              mb: 2,
              display: 'block'
            }}
          >
            Je suis :
          </FormLabel>
          <RadioGroup 
            row 
            value={role} 
            onChange={handleRoleChange} 
            sx={{ 
              mb: 3,
              justifyContent: 'center',
              gap: 3,
              '& .MuiFormControlLabel-label': {
                fontWeight: 600,
                fontSize: '1rem'
              },
              '& .MuiRadio-root': {
                '&.Mui-checked': {
                  color: VIOLET_BLUE
                },
                '&:hover': {
                  backgroundColor: `${VIOLET_BLUE}10`
                }
              },
              '& .MuiFormControlLabel-root': {
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 3,
                px: 3,
                py: 1,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `${VIOLET_BLUE}08`,
                  transform: 'scale(1.02)'
                }
              }
            }}
          >
            <FormControlLabel value="client" control={<Radio />} label="Client" />
            <FormControlLabel value="agency" control={<Radio />} label="Agence" />
          </RadioGroup>
          
          <TextField 
            label="Nom" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover fieldset': {
                  borderColor: `${PRIMARY_COLOR}60`,
                  borderWidth: 2
                },
                '&.Mui-focused fieldset': {
                  borderColor: PRIMARY_COLOR,
                  borderWidth: 2,
                  boxShadow: `0 0 0 3px ${PRIMARY_COLOR}20`
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: PRIMARY_COLOR,
                fontWeight: 600
              }
            }} 
          />
          
          <TextField 
            label="Email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover fieldset': {
                  borderColor: `${VIOLET_BLUE}60`,
                  borderWidth: 2
                },
                '&.Mui-focused fieldset': {
                  borderColor: VIOLET_BLUE,
                  borderWidth: 2,
                  boxShadow: `0 0 0 3px ${VIOLET_BLUE}20`
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: VIOLET_BLUE,
                fontWeight: 600
              }
            }} 
          />
          
          <TextField 
            label="Mot de passe" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            fullWidth 
            required 
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover fieldset': {
                  borderColor: `${VIOLET_PURPLE}60`,
                  borderWidth: 2
                },
                '&.Mui-focused fieldset': {
                  borderColor: VIOLET_PURPLE,
                  borderWidth: 2,
                  boxShadow: `0 0 0 3px ${VIOLET_PURPLE}20`
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: VIOLET_PURPLE,
                fontWeight: 600
              }
            }} 
          />
          
          {role === 'agency' && (
            <Box sx={{ 
              p: 4, 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${VIOLET_BLUE}05, ${VIOLET_PURPLE}03)`,
              border: `2px solid ${VIOLET_BLUE}20`,
              mb: 3,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                borderRadius: '3px 3px 0 0'
              }
            }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: VIOLET_BLUE, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🏢 Informations de l'agence
              </Typography>
              
              <TextField 
                label="Nom de l'agence" 
                name="agency_name" 
                value={form.agency_name} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: `${VIOLET_BLUE}60`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: VIOLET_BLUE,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: VIOLET_BLUE,
                    fontWeight: 600
                  }
                }} 
              />
              
              <TextField 
                label="Email de l'agence" 
                name="agency_email" 
                value={form.agency_email} 
                onChange={handleChange} 
                fullWidth 
                required 
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: `${VIOLET_PURPLE}60`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: VIOLET_PURPLE,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: VIOLET_PURPLE,
                    fontWeight: 600
                  }
                }} 
              />
              
              <TextField 
                label="Téléphone de l'agence" 
                name="agency_phone" 
                value={form.agency_phone} 
                onChange={handleChange} 
                fullWidth 
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: `${SECONDARY_COLOR}60`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: SECONDARY_COLOR,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: SECONDARY_COLOR,
                    fontWeight: 600
                  }
                }} 
              />
              
              <TextField 
                label="Description de l'agence" 
                name="agency_description" 
                value={form.agency_description} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={3} 
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: `${PRIMARY_COLOR}60`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                    fontWeight: 600
                  }
                }} 
              />
            </Box>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 4,
              mb: 3,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
              boxShadow: `0 8px 24px ${VIOLET_BLUE}30`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${PRIMARY_COLOR})`,
                boxShadow: `0 12px 32px ${VIOLET_BLUE}40`,
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </form>
        
        {success && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 3, 
              borderRadius: 3, 
              background: 'rgba(76, 175, 80, 0.08)',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography color="success.main" fontWeight={700} sx={{ textAlign: 'center' }}>
              ✅ {success}
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 3, 
              borderRadius: 3, 
              background: `${ACCENT_RED}08`,
              border: `2px solid ${ACCENT_RED}30`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography sx={{ color: ACCENT_RED, fontWeight: 700, textAlign: 'center' }}>
              ❌ {error}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
