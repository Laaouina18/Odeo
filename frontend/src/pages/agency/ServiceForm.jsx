import React, { useState } from 'react';
import { createService } from '../../api/services';
import { Box, Typography, TextField, Button, Paper, Stack, Chip, OutlinedInput, InputLabel } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';

const categoriesList = ['Voyage', 'Quad', 'Excursions', 'Tourisme', 'Autres'];

const ServiceForm = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '', price: '', location: '', images: [], dates: [], status: 'inactive' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleDatesChange = (e) => {
    setForm({ ...form, dates: e.target.value.split(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Récupérer agency_id depuis localStorage
      const agency_id = localStorage.getItem('agency_id');
      if (!agency_id) throw new Error('agency_id non trouvé');
      // Préparer payload
      const payload = {
        agency_id,
        title: form.title,
        description: form.description,
        category_id: form.category, // à adapter si tu utilises l'id réel
        price: form.price,
        location: form.location,
        images: form.images,
        status: form.status,
        dates: form.dates,
      };
      await createService(payload);
      setSuccess('Service enregistré !');
      setAlertOpen(true);
      setForm({ title: '', description: '', category: '', price: '', location: '', images: [], dates: [], status: 'inactive' });
      // Redirection à implémenter
    } catch (err) {
      setError('Erreur lors de l’enregistrement du service');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Créer / Éditer Service</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField label="Titre" name="title" fullWidth margin="normal" required value={form.title} onChange={handleChange} />
          <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={3} required value={form.description} onChange={handleChange} />
          <InputLabel sx={{ mt: 2 }}>Catégorie</InputLabel>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            {categoriesList.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                color={form.category === cat ? 'primary' : 'default'}
                onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
              />
            ))}
          </Stack>
          <TextField label="Prix (€)" name="price" type="number" fullWidth margin="normal" required value={form.price} onChange={handleChange} />
          <TextField label="Localisation" name="location" fullWidth margin="normal" value={form.location} onChange={handleChange} />
          <InputLabel sx={{ mt: 2 }}>Images (upload multiple)</InputLabel>
          <OutlinedInput type="file" name="images" inputProps={{ multiple: true }} onChange={handleImagesChange} sx={{ mb: 2 }} />
          <TextField label="Dates disponibles (séparées par virgule)" name="dates" fullWidth margin="normal" value={form.dates.join(',')} onChange={handleDatesChange} />
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant={form.status === 'active' ? 'contained' : 'outlined'} color="primary" onClick={() => setForm((prev) => ({ ...prev, status: 'active' }))}>Activer</Button>
            <Button variant={form.status === 'inactive' ? 'contained' : 'outlined'} color="secondary" onClick={() => setForm((prev) => ({ ...prev, status: 'inactive' }))}>Désactiver</Button>
          </Stack>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </form>
        <Typography variant="body2" mt={2} color="text.secondary">
          <strong>Preview :</strong> {form.title} — {form.category} — {form.price} €
        </Typography>
      </Paper>
      <AlertSnackbar open={alertOpen} onClose={() => setAlertOpen(false)} severity={error ? 'error' : 'success'} message={error || success} />
    </Box>
  );
};

export default ServiceForm;
