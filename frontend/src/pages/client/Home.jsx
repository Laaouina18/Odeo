import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const categories = ['Voyage', 'Quad', 'Excursions', 'Tourisme', 'Autres'];

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Rediriger vers /services avec paramètres de recherche et catégorie
    let params = '';
    if (search) params += `?q=${encodeURIComponent(search)}`;
    if (selectedCategory) params += (params ? '&' : '?') + `category=${encodeURIComponent(selectedCategory)}`;
    navigate(`/services${params}`);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    // Rediriger vers /services avec catégorie sélectionnée
    navigate(`/services?category=${encodeURIComponent(cat)}`);
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh">
      <Box sx={{ pt: 8, pb: 6, textAlign: 'center', background: 'linear-gradient(90deg, #1976d2 60%, #ff9800 100%)', color: '#fff' }}>
        <Typography variant="h2" fontWeight={700} mb={2}>Trouvez votre activité idéale</Typography>
        <Typography variant="h5" mb={4}>Voyage, aventure, détente... tout est sur Odeo !</Typography>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <TextField
            placeholder="Rechercher un service ou une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 300 }}
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>Rechercher</Button>
        </form>
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              color={selectedCategory === cat ? 'primary' : 'default'}
              onClick={() => handleCategoryClick(cat)}
              sx={{ fontSize: 16, px: 2, py: 1 }}
            />
          ))}
        </Stack>
      </Box>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
        <Typography variant="h4" fontWeight={600} mb={4}>Services mis en avant</Typography>
        <Grid container spacing={4}>
          {[1,2,3,4].map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={700}>Service {s}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>Description du service {s}...</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate(`/services/${s}`)}>Voir le détail</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ bgcolor: '#fff', py: 6, px: { xs: 2, md: 8 } }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">Témoignages clients</Typography>
        <Grid container spacing={4} justifyContent="center">
          {[1,2,3].map((t) => (
            <Grid item xs={12} md={4} key={t}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="body1" fontStyle="italic">“Super expérience ! Je recommande Odeo à 100%.”</Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>Client {t}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ bgcolor: 'background.default', py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">© 2025 Odeo — Tous droits réservés</Typography>
      </Box>
    </Box>
  );
};

export default Home;
