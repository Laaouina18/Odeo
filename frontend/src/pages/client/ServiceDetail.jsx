import React from 'react';
import { Box, Typography, Grid, Paper, Button, Chip, Stack, Rating, Avatar } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';

const images = [
  'https://source.unsplash.com/random/400x300?activity1',
  'https://source.unsplash.com/random/400x300?activity2',
  'https://source.unsplash.com/random/400x300?activity3',
];

const ServiceDetail = () => {
  const navigate = useNavigate();
  // Simulation de données
  const service = {
    title: 'Excursion Quad Désert',
    description: 'Partez à l’aventure en quad dans le désert avec guide et équipements fournis.',
    price: 120,
    category: 'Quad',
    rating: 4.5,
    agency: { name: 'Agence Sahara', logo: '', description: 'Spécialiste des activités désert.' },
    availableDates: ['2025-08-20', '2025-08-21', '2025-08-22'],
  };
  const reviews = [
    { user: 'Alice', rating: 5, comment: 'Incroyable expérience !' },
    { user: 'Bob', rating: 4, comment: 'Super guide, paysages magnifiques.' },
  ];
  const similar = [
    { id: 2, title: 'Excursion Buggy', price: 130 },
    { id: 3, title: 'Balade à dos de chameau', price: 80 },
  ];

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {images.map((img, i) => (
              <Paper key={i} elevation={2} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <img src={img} alt={`service-img-${i}`} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              </Paper>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" fontWeight={700} mb={2}>{service.title}</Typography>
          <Chip label={service.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="body1" mb={2}>{service.description}</Typography>
          <Typography variant="h5" color="primary" fontWeight={700} mb={2}>{service.price} €</Typography>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <CalendarMonthIcon color="secondary" />
            <Typography variant="body2">Dates disponibles :</Typography>
            {service.availableDates.map((date) => (
              <Chip key={date} label={date} color="secondary" />
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Rating value={service.rating} precision={0.5} readOnly />
            <Typography variant="body2">{service.rating}/5</Typography>
          </Stack>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => navigate(`/direct-booking/1`)}
            sx={{ fontWeight: 700, py: 2, borderRadius: 3, mb: 2 }}
          >
            Réserver maintenant (Sans paiement)
          </Button>
          <Paper elevation={1} sx={{ mt: 4, p: 2, borderRadius: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={service.agency.logo} alt={service.agency.name} />
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>{service.agency.name}</Typography>
                <Typography variant="body2" color="text.secondary">{service.agency.description}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} mb={2}>Avis clients</Typography>
        <Grid container spacing={2}>
          {reviews.map((r, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar>{r.user[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{r.user}</Typography>
                    <Rating value={r.rating} readOnly size="small" />
                  </Box>
                </Stack>
                <Typography variant="body2" mt={2}>{r.comment}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} mb={2}>Services similaires</Typography>
        <Grid container spacing={2}>
          {similar.map((s) => (
            <Grid item xs={12} md={4} key={s.id}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 4, textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>{s.title}</Typography>
                <Typography variant="body2" color="primary" fontWeight={600}>{s.price} €</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 1 }} onClick={() => navigate(`/services/${s.id}`)}>Voir</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
