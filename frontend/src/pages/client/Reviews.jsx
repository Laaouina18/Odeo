import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Rating, TextField, Stack } from '@mui/material';

const initialReviews = [
  { id: 1, service: 'Excursion Quad', note: 5, commentaire: 'Super !' },
  { id: 2, service: 'Balade Chameau', note: 4, commentaire: 'Très sympa.' },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ service: '', note: 0, commentaire: '' });

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleRating = (e, value) => {
    setNewReview({ ...newReview, note: value });
  };

  const handleAdd = () => {
    if (newReview.service && newReview.note > 0 && newReview.commentaire) {
      setReviews([...reviews, { ...newReview, id: Date.now() }]);
      setNewReview({ service: '', note: 0, commentaire: '' });
    }
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Mes avis</Typography>
      <Stack spacing={2} mb={4}>
        {reviews.length === 0 ? (
          <Typography>Aucun avis pour le moment.</Typography>
        ) : reviews.map(r => (
          <Paper key={r.id} elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6">{r.service}</Typography>
            <Rating value={r.note} readOnly sx={{ mb: 1 }} />
            <Typography variant="body2">{r.commentaire}</Typography>
          </Paper>
        ))}
      </Stack>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" mb={2}>Laisser un nouvel avis</Typography>
        <TextField label="Service" name="service" value={newReview.service} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Rating value={newReview.note} onChange={handleRating} sx={{ mb: 2 }} />
        <TextField label="Commentaire" name="commentaire" value={newReview.commentaire} onChange={handleChange} fullWidth multiline rows={2} sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={handleAdd}>Ajouter l'avis</Button>
      </Paper>
    </Box>
  );
};

export default Reviews;
