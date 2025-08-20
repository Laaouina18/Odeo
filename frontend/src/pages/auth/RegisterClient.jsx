import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Inscription Client</Typography>
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
