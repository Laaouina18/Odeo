import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, Stack, Select, MenuItem, TextField } from '@mui/material';

const statusOptions = ['Confirmée', 'En attente', 'Annulée'];
const servicesList = ['Quad', 'Buggy', 'Chameau'];

const Bookings = () => {
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  // Simulation de réservations
  const [bookings, setBookings] = useState([
    { id: 1, client: 'Alice', service: 'Quad', date: '2025-08-20', status: 'Confirmée' },
    { id: 2, client: 'Bob', service: 'Buggy', date: '2025-08-21', status: 'En attente' },
  ]);

  const handleConfirm = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Confirmée' } : b));
  };
  const handleCancel = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Annulée' } : b));
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Réservations reçues</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={4}>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty sx={{ minWidth: 150 }}>
          <MenuItem value=""><em>Statut</em></MenuItem>
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
        <Select value={service} onChange={(e) => setService(e.target.value)} displayEmpty sx={{ minWidth: 150 }}>
          <MenuItem value=""><em>Service</em></MenuItem>
          {servicesList.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
        <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} sx={{ minWidth: 150 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" color="primary">Filtrer</Button>
        <Button variant="outlined" color="secondary">Exporter</Button>
      </Stack>
      <Grid container spacing={4}>
        {bookings.map((b) => (
          <Grid item xs={12} md={6} key={b.id}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={b.status} color={b.status === 'Confirmée' ? 'primary' : b.status === 'Annulée' ? 'error' : 'default'} />
                <Typography variant="body1" fontWeight={600}>{b.client}</Typography>
                <Typography variant="body2">{b.service}</Typography>
                <Typography variant="body2">{b.date}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="outlined" color="primary" onClick={() => handleConfirm(b.id)} disabled={b.status === 'Confirmée'}>Confirmer</Button>
                <Button variant="outlined" color="error" onClick={() => handleCancel(b.id)} disabled={b.status === 'Annulée'}>Annuler</Button>
                <Button variant="outlined" color="secondary" onClick={() => window.open(`mailto:${b.client}@example.com`)}>Contacter client</Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Bookings;
