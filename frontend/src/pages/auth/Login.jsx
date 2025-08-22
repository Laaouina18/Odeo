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
        background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.1) 0%, rgba(129, 39, 85, 0.05) 50%, #ffffff 100%)',
        padding: 2
      }}
    >
      <Paper 
        elevation={24}
        className="glass-card animate-fade-in-up"
        sx={{ 
          p: 5, 
          minWidth: 400,
          maxWidth: 450,
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
            Connexion
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
            fullWidth 
            margin="normal" 
            required 
            value={form.password} 
            onChange={handleChange}
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
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        
        {!isAuthenticated && (
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Pas de compte ?{' '}
              <Typography 
                component="a" 
                href="/register" 
                variant="body2"
                sx={{
                  color: 'rgb(129, 39, 85)',
                  textDecoration: 'none',
                  fontWeight: 600,
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
