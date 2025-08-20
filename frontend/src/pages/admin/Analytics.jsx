
import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import PieChartIcon from '@mui/icons-material/PieChart';

// Simulated data
const kpis = { ca: 120000, bookings: 450, agencies: 18, clients: 1200 };
const monthlyRevenue = [12000, 15000, 11000, 17000, 14000, 18000, 16000];
const agencyDistribution = [
  { name: 'Sahara', value: 40000 },
  { name: 'Atlas', value: 30000 },
  { name: 'Merzouga', value: 20000 },
  { name: 'Autres', value: 30000 },
];

const COLORS = ['#1976d2', '#9c27b0', '#ff9800', '#4caf50'];

const Analytics = () => {
  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Analytics Globales</Typography>
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>CA Total</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{kpis.ca} €</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <BarChartIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Réservations</Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>{kpis.bookings}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <GroupIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Agences</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>{kpis.agencies}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <GroupIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>Clients</Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>{kpis.clients}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Revenus mensuels</Typography>
            <Box display="flex" alignItems="flex-end" height={180}>
              {monthlyRevenue.map((val, i) => (
                <Box key={i} mx={1} flex={1} display="flex" flexDirection="column" alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: `${val / 200}px`,
                      bgcolor: COLORS[i % COLORS.length],
                      borderRadius: 2,
                    }}
                  />
                  <Typography variant="caption">M{i + 1}</Typography>
                  <Typography variant="caption" color="text.secondary">{val} €</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Répartition CA par agence</Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height={180}>
              <Box position="relative" width={140} height={140}>
                {/* Pie chart simulation */}
                {agencyDistribution.map((a, i) => {
                  const total = agencyDistribution.reduce((sum, ag) => sum + ag.value, 0);
                  const startAngle = agencyDistribution.slice(0, i).reduce((sum, ag) => sum + (ag.value / total) * 360, 0);
                  const angle = (a.value / total) * 360;
                  return (
                    <Box
                      key={a.name}
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        clipPath: `polygon(50% 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
                        transform: `rotate(${startAngle}deg)`,
                        background: COLORS[i % COLORS.length],
                        borderRadius: '50%',
                        opacity: 0.7,
                        zIndex: i,
                      }}
                    />
                  );
                })}
                <Box position="absolute" top={0} left={0} width={140} height={140} borderRadius="50%" bgcolor="background.paper" opacity={0.1} />
              </Box>
              <Stack ml={3} spacing={1}>
                {agencyDistribution.map((a, i) => (
                  <Box key={a.name} display="flex" alignItems="center">
                    <Box width={16} height={16} bgcolor={COLORS[i % COLORS.length]} borderRadius={2} mr={1} />
                    <Typography variant="body2">{a.name}: {a.value} €</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
