import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Checkbox, FormControlLabel } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [form, setForm] = useState({ card_number: '', card_name: '', card_expiry: '', card_cvc: '', cgv: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  // Simulation de commande
  const booking = { service: 'Excursion Quad', date: '2025-08-20', people: 2, total: 170 };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Désactivation de la validation et confirmation du paiement
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAlertOpen(false);
    // Ne rien faire, pas de validation ni redirection
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Paiement</Typography>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>Récapitulatif commande</Typography>
          <Typography variant="body2">Service : {booking.service}</Typography>
          <Typography variant="body2">Date : {booking.date}</Typography>
          <Typography variant="body2">Personnes : {booking.people}</Typography>
          <Typography variant="body1" fontWeight={600} color="primary">Total : {booking.total} €</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField label="Numéro de carte" name="card_number" fullWidth margin="normal" required value={form.card_number} onChange={handleChange} />
          <TextField label="Nom sur la carte" name="card_name" fullWidth margin="normal" required value={form.card_name} onChange={handleChange} />
          <TextField label="Date d’expiration" name="card_expiry" fullWidth margin="normal" required value={form.card_expiry} onChange={handleChange} />
          <TextField label="CVC" name="card_cvc" fullWidth margin="normal" required value={form.card_cvc} onChange={handleChange} />
          <FormControlLabel
            control={<Checkbox name="cgv" checked={form.cgv} onChange={handleChange} />}
            label={<Typography variant="body2">J’accepte les <a href="#">conditions générales</a></Typography>}
            sx={{ mt: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Paiement...' : 'Confirmer et payer'}
          </Button>
        </form>
      </Paper>
      <AlertSnackbar open={alertOpen} onClose={() => setAlertOpen(false)} severity={error ? 'error' : 'success'} message={error || success} />
    </Box>
  );
};

export default Payment;
