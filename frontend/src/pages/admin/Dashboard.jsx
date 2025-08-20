import React from 'react';
import { Box, Typography, Paper, Grid, Button, Stack, Chip } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';

const Dashboard = () => {
  // Simulation de données
  const kpis = { agences: 8, clients: 120, reservations: 45, ca: 12000 };
  const topAgences = [
    { name: 'Sahara', ca: 4000 },
    { name: 'Atlas', ca: 3000 },
    { name: 'Merzouga', ca: 2000 },
  ];
  const alerts = ['Agence Atlas en attente de validation', 'Nouvelle transaction à vérifier'];

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Dashboard Admin</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <GroupIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Agences</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{kpis.agences}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <GroupIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Clients</Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>{kpis.clients}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Réservations</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{kpis.reservations}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>CA Total</Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>{kpis.ca} €</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} mb={2}>Top agences par CA</Typography>
        <Grid container spacing={2}>
          {topAgences.map((a, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 4, textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>{a.name}</Typography>
                <Typography variant="body2" color="primary" fontWeight={600}>{a.ca} €</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} mb={2}>Alertes & notifications</Typography>
        <Stack spacing={1}>
          {alerts.map((a, i) => (
            <Chip key={i} label={a} color="error" />
          ))}
        </Stack>
      </Box>
      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} mb={2}>Accès rapide</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" href="/admin/analytics">Analytics</Button>
          <Button variant="outlined" color="primary" href="/admin/agencies">Agences</Button>
          <Button variant="outlined" color="primary" href="/admin/transactions">Transactions</Button>
          <Button variant="outlined" color="primary" href="/admin/settings">Paramètres</Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Dashboard;
