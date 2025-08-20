import React from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';

const Confirmation = () => {
  // Simulation de données
  const booking = {
    service: 'Excursion Quad',
    date: '2025-08-20',
    people: 2,
    total: 170,
    invoice: 'facture_123.pdf',
    agency: { name: 'Agence Sahara', email: 'contact@sahara.com', phone: '0600000000' },
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, textAlign: 'center' }}>
        <Typography variant="h5" mb={2} fontWeight={700} color="primary">
          Réservation confirmée !
        </Typography>
        <Typography variant="body1" mb={2}>
          Merci pour votre confiance. Voici le récapitulatif de votre réservation :
        </Typography>
        <Stack spacing={1} mb={2}>
          <Typography variant="body2">Service : {booking.service}</Typography>
          <Typography variant="body2">Date : {booking.date}</Typography>
          <Typography variant="body2">Personnes : {booking.people}</Typography>
          <Typography variant="body1" fontWeight={600} color="primary">
            Total : {booking.total} €
          </Typography>
        </Stack>
        <Button 
          variant="outlined" 
          color="secondary" 
          sx={{ mb: 2 }} 
          href={booking.invoice} 
          download
        >
          Télécharger la facture PDF
        </Button>
        <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Contact Agence
          </Typography>
          <Typography variant="body2">{booking.agency.name}</Typography>
          <Typography variant="body2">Email : {booking.agency.email}</Typography>
          <Typography variant="body2">Téléphone : {booking.agency.phone}</Typography>
        </Paper>
        <Button variant="contained" color="primary" href="/">
          Retour à l'accueil
        </Button>
      </Paper>
    </Box>
  );
};

export default Confirmation;