import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, Stack } from '@mui/material';

const initialFavorites = [
  { id: 1, title: 'Excursion Buggy' },
  { id: 2, title: 'Tour en bateau' },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemove = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Mes favoris</Typography>
      <Stack spacing={2}>
        {favorites.length === 0 ? (
          <Typography>Aucun favori pour le moment.</Typography>
        ) : favorites.map(f => (
          <Paper key={f.id} elevation={2} sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{f.title}</Typography>
            <Button variant="outlined" color="error" onClick={() => handleRemove(f.id)}>Retirer</Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default Favorites;
