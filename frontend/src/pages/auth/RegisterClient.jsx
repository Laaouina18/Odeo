import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

// Professional Fresh Color Palette
const PRIMARY_COLOR = '#1e3c72';
const SECONDARY_COLOR = '#2a5298';
const VIOLET_BLUE = '#667eea';
const VIOLET_PURPLE = '#764ba2';
const ACCENT_RED = '#ff4d4f';

const RegisterClient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '', role: 'client' });
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
      await register(form);
      setSuccess('Inscription réussie ! Vérifiez votre email.');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’inscription');
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
        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 25%, ${VIOLET_BLUE} 50%, ${VIOLET_PURPLE} 75%, ${PRIMARY_COLOR} 100%)`,
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          minWidth: 400, 
          maxWidth: 480,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 4,
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              background: `linear-gradient(45deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            👤 Inscription Client
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontWeight: 500 
            }}
          >
            Créez votre compte personnel
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField label="Nom complet" name="name" fullWidth margin="normal" required value={form.name} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" required value={form.email} onChange={handleChange} />
          <TextField label="Téléphone" name="phone" fullWidth margin="normal" required value={form.phone} onChange={handleChange} />
          <TextField label="Mot de passe" name="password" type="password" fullWidth margin="normal" required value={form.password} onChange={handleChange} />
          <TextField label="Confirmer le mot de passe" name="password_confirmation" type="password" fullWidth margin="normal" required value={form.password_confirmation} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Inscription...' : 'S’inscrire'}
          </Button>
        </form>
        <Typography variant="body2" mt={2} color="text.secondary">
          Déjà un compte ? <a href="/login">Connectez-vous</a>
        </Typography>
      </Paper>
      <AlertSnackbar open={alertOpen} onClose={() => setAlertOpen(false)} severity={error ? 'error' : 'success'} message={error || success} />
    </Box>
  );
};

export default RegisterClient;
