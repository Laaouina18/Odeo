import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Chip, Stack, InputLabel, OutlinedInput } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const categoriesList = ['Voyage', 'Quad', 'Excursions', 'Tourisme', 'Autres'];

const RegisterAgency = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '', description: '', logo: null, categories: [], role: 'agency' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setForm({ ...form, logo: e.target.files[0] });
  };

  const handleCategoriesChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, categories: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'categories') {
          value.forEach((cat, idx) => formData.append(`categories[${idx}]`, cat));
        } else {
          formData.append(key, value);
        }
      });
      await register(formData);
      setSuccess('Inscription agence réussie ! Statut en attente de validation.');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’inscription agence');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Inscription Agence</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField label="Nom de l'agence" name="name" fullWidth margin="normal" required value={form.name} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" required value={form.email} onChange={handleChange} />
          <TextField label="Téléphone" name="phone" fullWidth margin="normal" required value={form.phone} onChange={handleChange} />
          <TextField label="Mot de passe" name="password" type="password" fullWidth margin="normal" required value={form.password} onChange={handleChange} />
          <TextField label="Confirmer le mot de passe" name="password_confirmation" type="password" fullWidth margin="normal" required value={form.password_confirmation} onChange={handleChange} />
          <TextField label="Description de l'agence" name="description" fullWidth margin="normal" multiline rows={3} value={form.description} onChange={handleChange} />
          <InputLabel sx={{ mt: 2 }}>Logo de l'agence</InputLabel>
          <OutlinedInput type="file" name="logo" onChange={handleLogoChange} sx={{ mb: 2 }} />
          <InputLabel sx={{ mt: 2 }}>Catégories de services</InputLabel>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            {categoriesList.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                color={form.categories.includes(cat) ? 'primary' : 'default'}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    categories: prev.categories.includes(cat)
                      ? prev.categories.filter((c) => c !== cat)
                      : [...prev.categories, cat],
                  }));
                }}
              />
            ))}
          </Stack>
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

export default RegisterAgency;
