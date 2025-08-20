import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAgencyProfile, updateAgencyProfile, deleteAgencyProfile } from '../../api/profile';
import { Box, Typography, Paper, TextField, Button, Avatar, Stack, OutlinedInput, InputLabel } from '@mui/material';

const Profile = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', description: '', logo: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // Load profile from localStorage only
  useEffect(() => {
    const storedUser = localStorage.getItem('agency');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm(user);
      // fetch agency profile to get agency.id
      getAgencyProfile().then(agency => {
        if (agency && agency.id) {
          localStorage.setItem('agency_id', agency.id);
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setForm({ ...form, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    // Validate required fields before sending
    if (!form.name || !form.email) {
      setError('Le nom et l’email sont obligatoires.');
      setLoading(false);
      return;
    }
    try {
      // Only send valid fields
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        description: form.description || '',
        logo: form.logo || '',
      };
      const updated = await updateAgencyProfile(payload);
      setForm(updated);
      localStorage.setItem('agency', JSON.stringify(updated));
      if (updated && updated.id) {
        localStorage.setItem('agency_id', updated.id);
      }
      setSuccess('Profil mis à jour !');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError('Erreur: ' + err.response.data.error);
      } else {
        setError('Erreur mise à jour profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteAgencyProfile();
      setSuccess('Profil supprimé');
      // Redirection ou déconnexion à implémenter
    } catch {
      setError('Erreur suppression profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Profil Agence</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar src={form.logo ? URL.createObjectURL(form.logo) : ''} alt={form.name} sx={{ width: 56, height: 56 }} />
            <Button variant="outlined" component="label">
              Changer le logo
              <input type="file" hidden name="logo" onChange={handleLogoChange} />
            </Button>
          </Stack>
          <TextField label="Nom de l'agence" name="name" fullWidth margin="normal" required value={form.name || ''} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" required value={form.email || ''} onChange={handleChange} />
          <TextField label="Téléphone" name="phone" fullWidth margin="normal" required value={form.phone || ''} onChange={handleChange} />
          <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={3} value={form.description || ''} onChange={handleChange} />
          <InputLabel sx={{ mt: 2 }}>Photos de présentation</InputLabel>
          <OutlinedInput type="file" name="photos" inputProps={{ multiple: true }} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete} fullWidth sx={{ mt: 2 }} disabled={loading}>
            Supprimer le profil
          </Button>
          {success && <Typography color="success.main" mt={2}>{success}</Typography>}
          {error && <Typography color="error.main" mt={2}>{error}</Typography>}
        </form>
        {success && <Typography variant="body2" mt={2} color="success.main">{success}</Typography>}
        <Typography variant="body2" mt={2} color="text.secondary">
          <strong>Facturation :</strong> IBAN, SIRET, etc. (à compléter)
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
