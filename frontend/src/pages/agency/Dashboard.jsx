import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, Stack } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // Simulation de données
  const stats = { reservations: 12, ca: 2400, tauxOccupation: '80%' };
  const reservations = [
    { id: 1, client: 'Alice', service: 'Quad', date: '2025-08-20', status: 'Confirmée' },
    { id: 2, client: 'Bob', service: 'Buggy', date: '2025-08-21', status: 'En attente' },
  ];
  const notifications = ['Nouvelle réservation reçue', 'Service Quad validé'];

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Tableau de bord Agence</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Réservations du mois</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{stats.reservations}</Typography>
            <Typography variant="body2" color="text.secondary">Taux d’occupation : {stats.tauxOccupation}</Typography>
            <Typography variant="body2" color="text.secondary">CA : {stats.ca} €</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Dernières réservations</Typography>
            {reservations.map((r) => (
              <Box key={r.id} mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip label={r.status} color={r.status === 'Confirmée' ? 'primary' : 'default'} />
                  <Typography variant="body1" fontWeight={600}>{r.client}</Typography>
                  <Typography variant="body2">{r.service}</Typography>
                  <Typography variant="body2">{r.date}</Typography>
                </Stack>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Notifications</Typography>
            <Stack spacing={1}>
              {notifications.map((n, i) => (
                <Chip key={i} label={n} color="secondary" />
              ))}
            </Stack>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/agency/services/create')}>Créer un service</Button>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={6} display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" color="primary" onClick={() => navigate('/agency/services')}>Gérer mes services</Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/agency/bookings')}>Réservations</Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/agency/analytics')}>Statistiques</Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/agency/profile')}>Profil agence</Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
