import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, Stack, TextField, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['Actif', 'Inactif'];

const Services = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  // Simulation de services
  const services = [
    { id: 1, title: 'Quad Désert', status: 'Actif', stats: 12 },
    { id: 2, title: 'Buggy Plage', status: 'Inactif', stats: 5 },
  ];

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Gestion des services</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={4}>
        <TextField
          placeholder="Rechercher un service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty sx={{ minWidth: 150 }}>
          <MenuItem value=""><em>Statut</em></MenuItem>
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
  <Button variant="contained" color="primary" onClick={() => navigate('/agency/services/create')}>Créer nouveau service</Button>
      </Stack>
      <Grid container spacing={4}>
        {services.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6" fontWeight={700}>{s.title}</Typography>
                <Chip label={s.status} color={s.status === 'Actif' ? 'primary' : 'default'} />
                <Typography variant="body2">Réservations : {s.stats}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="outlined" color="primary" onClick={() => navigate(`/agency/services/edit/${s.id}`)}>Éditer</Button>
                <Button variant="outlined" color="secondary">Dupliquer</Button>
                <Button variant="outlined" color="error">Supprimer</Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Services;
