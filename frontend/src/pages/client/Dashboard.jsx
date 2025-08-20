import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, Stack, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // Simulation de données
  const reservations = [
    { id: 1, service: 'Excursion Quad', date: '2025-08-20', status: 'En cours', facture: 'facture_1.pdf' },
    { id: 2, service: 'Balade Chameau', date: '2025-07-15', status: 'Terminée', facture: 'facture_2.pdf' },
  ];
  const favoris = ['Excursion Buggy', 'Tour en bateau'];
  const avis = [
    { service: 'Excursion Quad', note: 5, commentaire: 'Super !' },
    { service: 'Balade Chameau', note: 4, commentaire: 'Très sympa.' },
  ];
  const profil = { name: 'Client Test', email: 'client@test.com', phone: '0600000000' };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Mon espace client</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Réservations</Typography>
            {reservations.map((r) => (
              <Box key={r.id} mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip label={r.status} color={r.status === 'En cours' ? 'primary' : 'default'} />
                  <Typography variant="body1" fontWeight={600}>{r.service}</Typography>
                  <Typography variant="body2">{r.date}</Typography>
                  <Button variant="outlined" color="secondary" size="small" href={r.facture} download>Télécharger facture</Button>
                </Stack>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Favoris</Typography>
            <Stack direction="row" spacing={2}>
              {favoris.map((f, i) => (
                  <Chip key={i} label={f} color="primary" />
              ))}
            </Stack>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/client/favorites')}>Gérer mes favoris</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Mes avis</Typography>
            {avis.map((a, i) => (
              <Box key={i} mb={2}>
                <Typography variant="body1" fontWeight={600}>{a.service}</Typography>
                <Chip label={`Note : ${a.note}/5`} color="secondary" />
                <Typography variant="body2">{a.commentaire}</Typography>
              </Box>
            ))}
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/client/reviews')}>Gérer mes avis</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Profil</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{profil.name[0]}</Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>{profil.name}</Typography>
                <Typography variant="body2">Email : {profil.email}</Typography>
                <Typography variant="body2">Téléphone : {profil.phone}</Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" color="primary" onClick={() => navigate('/client/profile')}>Modifier mes infos</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
