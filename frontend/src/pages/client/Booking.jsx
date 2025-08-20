import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, MenuItem } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { useNavigate } from 'react-router-dom';

const dates = ['2025-08-20', '2025-08-21', '2025-08-22'];
const optionsList = ['Guide privé', 'Repas inclus', 'Transfert hôtel'];

const Booking = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', people: 1, options: [], name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionsChange = (opt) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.includes(opt)
        ? prev.options.filter((o) => o !== opt)
        : [...prev.options, opt],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Appel API à implémenter
      // Supposons que l'API retourne un bookingId
      const bookingId = Math.floor(Math.random() * 10000) + 1; // à remplacer par la vraie réponse API
      setSuccess('Réservation enregistrée, passez au paiement.');
      setAlertOpen(true);
      setTimeout(() => {
        navigate(`/payment/${bookingId}`);
      }, 1200);
    } catch (err) {
      setError('Erreur lors de la réservation');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = 120 + form.options.length * 20 + (form.people - 1) * 30;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Réservation</Typography>
        <form onSubmit={handleSubmit}>
          <TextField select label="Date" name="date" fullWidth margin="normal" required value={form.date} onChange={handleChange}>
            {dates.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>
          <TextField label="Nombre de personnes" name="people" type="number" fullWidth margin="normal" required value={form.people} onChange={handleChange} inputProps={{ min: 1 }} />
          <Typography variant="subtitle1" mt={2}>Options supplémentaires</Typography>
          <Stack direction="row" spacing={1} mb={2}>
            {optionsList.map((opt) => (
              <Button
                key={opt}
                variant={form.options.includes(opt) ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleOptionsChange(opt)}
              >
                {opt}
              </Button>
            ))}
          </Stack>
          <Typography variant="body1" fontWeight={600} color="primary" mb={2}>Prix total : {totalPrice} €</Typography>
          <TextField label="Nom complet" name="name" fullWidth margin="normal" required value={form.name} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" required value={form.email} onChange={handleChange} />
          <TextField label="Téléphone" name="phone" fullWidth margin="normal" required value={form.phone} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Réservation...' : 'Réserver et payer'}
          </Button>
        </form>
      </Paper>
      <AlertSnackbar open={alertOpen} onClose={() => setAlertOpen(false)} severity={error ? 'error' : 'success'} message={error || success} />
    </Box>
  );
};

export default Booking;
