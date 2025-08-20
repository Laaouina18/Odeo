import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Chip, Stack, Select, MenuItem, Pagination, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useSearchParams } from 'react-router-dom';
const categories = ['Voyage', 'Quad', 'Excursions', 'Tourisme', 'Autres'];
const sortOptions = [
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'rating', label: 'Note' },
];

const ServicesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [favorites, setFavorites] = useState([]);

  // Simulation de services
  const services = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Service ${i + 1}`,
    category: categories[i % categories.length],
    price: 100 + i * 10,
    rating: 4 + (i % 2),
  }));

  const handleFavorite = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleFilter = () => {
    const params = {};
    if (search) params.q = search;
    if (selectedCategory) params.category = selectedCategory;
    if (sort) params.sort = sort;
    params.page = 1;
    setPage(1);
    setSearchParams(params);
  };

  const handleDetail = (id) => {
    navigate(`/services/${id}`);
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh" px={{ xs: 2, md: 8 }} py={6}>
      <Typography variant="h4" fontWeight={700} mb={4}>Services disponibles</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={4}>
        <TextField
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ minWidth: 150 }}>
          <MenuItem value=""><em>Catégorie</em></MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 150 }}>
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
  <Button variant="contained" color="primary" onClick={handleFilter}>Filtrer</Button>
      </Stack>
      <Grid container spacing={4}>
        {services.slice((page-1)*8, page*8).map((service) => (
          <Grid item xs={12} sm={6} md={3} key={service.id}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, position: 'relative' }}>
              <Typography variant="h6" fontWeight={700}>{service.title}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>{service.category}</Typography>
              <Typography variant="body1" fontWeight={600} color="primary">{service.price} €</Typography>
              <Typography variant="body2" color="text.secondary">Note : {service.rating}/5</Typography>
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8 }}
                color={favorites.includes(service.id) ? 'error' : 'default'}
                onClick={() => handleFavorite(service.id)}
              >
                <FavoriteIcon />
              </IconButton>
              <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleDetail(service.id)}>Voir le détail</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={6}>
        <Pagination count={Math.ceil(services.length/8)} page={page} onChange={(_, value) => { setPage(value); setSearchParams({ ...Object.fromEntries(searchParams), page: value }); }} color="primary" />
      </Box>
    </Box>
  );
};

export default ServicesList;
