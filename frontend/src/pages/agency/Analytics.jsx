import React from 'react';
import { Box, Typography, Paper, Grid, Button, Stack, LinearProgress, Avatar } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

const Analytics = () => {
  // Simulation de données
  const caStats = [
    { month: 'Juin', ca: 1200 },
    { month: 'Juillet', ca: 1800 },
    { month: 'Août', ca: 2400 },
  ];
  const topServices = [
    { title: 'Quad', count: 12 },
    { title: 'Buggy', count: 8 },
    { title: 'Chameau', count: 5 },
  ];
  const conversion = '65%';

  // Calcul pour bar chart
  const maxCA = Math.max(...caStats.map(s => s.ca));
  // Calcul pour pie chart
  const totalTop = topServices.reduce((acc, s) => acc + s.count, 0);
  const pieColors = ['#1976d2', '#ff9800', '#43a047'];

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Statistiques & Analytics</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>CA par mois</Typography>
            <Stack spacing={2}>
              {caStats.map((stat, i) => (
                <Box key={i}>
                  <Typography variant="body2" fontWeight={600}>{stat.month}</Typography>
                  <LinearProgress variant="determinate" value={stat.ca / maxCA * 100} sx={{ height: 10, borderRadius: 5, mb: 1, bgcolor: '#e3e3e3' }} color="primary" />
                  <Typography variant="body2" color="primary">{stat.ca} €</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <PieChartIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>Top services</Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              {topServices.map((s, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: pieColors[i % pieColors.length], mb: 1 }}>{s.title[0]}</Avatar>
                  <Typography variant="body2" fontWeight={600}>{s.title}</Typography>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: pieColors[i % pieColors.length], opacity: s.count / totalTop, mx: 'auto', mb: 1 }} />
                  <Typography variant="body2">{s.count} réservations</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Taux de conversion</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{conversion}</Typography>
            <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>Exporter rapport</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
