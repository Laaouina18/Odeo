import React, { useState } from 'react';
import { useEffect } from 'react';
import { getClientProfile, updateClientProfile, deleteClientProfile } from '../../api/profile';
import { Box, Typography, Paper, TextField, Button, Stack, Avatar } from '@mui/material';

const initialProfile = { name: 'Client Test', email: 'client@test.com', phone: '0600000000' };

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const updated = await updateClientProfile(profile);
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess('Profil mis à jour !');
      setEdit(false);
    } catch {
      setError('Erreur mise à jour profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteClientProfile();
      setSuccess('Profil supprimé');
      localStorage.removeItem('user');
      // Redirection ou déconnexion à implémenter
    } catch {
      setError('Erreur suppression profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Mon profil</Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 400, mx: 'auto' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar>{profile.name[0]}</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={600}>{profile.name}</Typography>
            <Typography variant="body2">Email : {profile.email}</Typography>
            <Typography variant="body2">Téléphone : {profile.phone}</Typography>
          </Box>
        </Stack>
        {edit ? (
          <>
            <TextField label="Nom" name="name" value={profile.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Télèphone" name="phone" value={profile.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>Enregistrer</Button>
            <Button variant="outlined" color="error" onClick={handleDelete} sx={{ ml: 2 }} disabled={loading}>Supprimer le profil</Button>
          </>
        ) : (
          <Button variant="outlined" color="primary" onClick={() => setEdit(true)}>Modifier</Button>
        )}
        {success && <Typography color="success.main" mt={2}>{success}</Typography>}
        {error && <Typography color="error.main" mt={2}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default Profile;
