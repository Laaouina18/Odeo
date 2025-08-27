import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { login } from '../../api/auth';
import { login as loginThunk } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';

const roles = [
  { value: 'client', label: 'Client' },
  { value: 'agency', label: 'Agence' },
  { value: 'admin', label: 'Admin' },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Redux auth state
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Palette de couleurs professionnelle
  const PRIMARY_COLOR = '#1e3c72';
  const SECONDARY_COLOR = '#2a5298';
  const VIOLET_BLUE = '#667eea';
  const VIOLET_PURPLE = '#764ba2';
  const ACCENT_RED = '#ff4d4f';

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'agency') navigate('/agency/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);


    const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const action = await dispatch(loginThunk(form));
      if (action.type === 'auth/login/fulfilled') {
        setSuccess('Connexion réussie !');
        setAlertOpen(true);
        // Navigation après mise à jour Redux
        setTimeout(() => {
          const role = action.payload.role;
          if (role === 'client') navigate('/client/dashboard');
          else if (role === 'agency') navigate('/agency/dashboard');
          else if (role === 'admin') navigate('/admin/dashboard');
          else navigate('/');
        }, 1200);
      } else {
        setError('Erreur de connexion');
        setAlertOpen(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
      setAlertOpen(true);
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
          minWidth: 420,
          maxWidth: 480,
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
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 8px 32px ${PRIMARY_COLOR}30`,
            '&::before': {
              content: '"🔐"',
              fontSize: '2rem',
            }
          }} />
          
          <Typography 
            variant="h3" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
              fontSize: '2.2rem'
            }}
          >
            Connexion
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Accédez à votre espace personnel
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            fullWidth 
            margin="normal" 
            required 
            value={form.email} 
            onChange={handleChange}
            sx={{
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
            label="Mot de passe" 
            name="password" 
            type="password" 
            fullWidth 
            margin="normal" 
            required 
            value={form.password} 
            onChange={handleChange}
            sx={{
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
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 4,
              mb: 2,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
              boxShadow: `0 8px 24px ${PRIMARY_COLOR}30`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                boxShadow: `0 12px 32px ${PRIMARY_COLOR}40`,
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        
        {!isAuthenticated && (
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Pas de compte ?{' '}
              <Typography 
                component="a" 
                href="/register" 
                variant="body2"
                sx={{
                  color: VIOLET_BLUE,
                  textDecoration: 'none',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Inscrivez-vous
              </Typography>
            </Typography>
          </Box>
        )}
      </Paper>
      <AlertSnackbar 
        open={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        severity={error ? 'error' : 'success'} 
        message={error || success} 
      />
    </Box>
  );
};

export default Login;
