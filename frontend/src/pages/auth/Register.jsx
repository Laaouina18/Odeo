import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/authSlice';


const Register = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
        background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.1) 0%, rgba(129, 39, 85, 0.05) 50%, #ffffff 100%)',
        padding: 2
      }}
    >
      <Paper 
        elevation={24}
        className="glass-card animate-fade-in-up"
        sx={{ 
          p: 5, 
          minWidth: 450,
          maxWidth: 500,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(129, 39, 85, 0.1)',
          boxShadow: '0 20px 60px rgba(129, 39, 85, 0.15)'
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h3" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, rgb(129, 39, 85), rgba(129, 39, 85, 0.7))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            Inscription
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Créez votre compte pour commencer
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <FormLabel 
            sx={{ 
              color: 'rgb(129, 39, 85)', 
              fontWeight: 600,
              fontSize: '1.1rem'
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
              '& .MuiFormControlLabel-label': {
                fontWeight: 500
              },
              '& .MuiRadio-root.Mui-checked': {
                color: 'rgb(129, 39, 85)'
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
          
          {role === 'agency' && (
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              background: 'rgba(129, 39, 85, 0.02)',
              border: '1px solid rgba(129, 39, 85, 0.1)',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'rgb(129, 39, 85)', fontWeight: 600 }}>
                Informations de l'agence
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
                    '&:hover fieldset': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  },
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
                    '&:hover fieldset': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  },
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
                    '&:hover fieldset': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  },
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
                  mb: 2,
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
            </Box>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
              boxShadow: '0 6px 20px rgba(129, 39, 85, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, rgba(129, 39, 85, 0.7) 100%)',
                boxShadow: '0 8px 25px rgba(129, 39, 85, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(129, 39, 85, 0.3)',
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
              p: 2, 
              borderRadius: 2, 
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}
          >
            <Typography color="success.main" fontWeight={600}>
              {success}
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2, 
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)'
            }}
          >
            <Typography color="error.main" fontWeight={600}>
              {error}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
