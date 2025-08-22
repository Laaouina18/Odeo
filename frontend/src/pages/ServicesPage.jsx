import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Pagination,
  useMediaQuery,
  useTheme,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star,
  LocationOn,
  AccessTime,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ServiceCardSkeleton } from '../components/SkeletonLoader.jsx';
import apiFetch from '../api/apiFetch';

const ServicesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
    loadServices();
  }, [currentPage, searchQuery, selectedCategory, sortBy, sortOrder, priceRange]);

  useEffect(() => {
    // Synchroniser avec les paramètres URL
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    if (q) setSearchQuery(q);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await apiFetch('/categories');
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort_by: sortBy,
        sort_order: sortOrder,
        status: 'active'
      });

      if (searchQuery.trim()) {
        params.append('q', searchQuery);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (priceRange[0] > 0) {
        params.append('min_price', priceRange[0].toString());
      }

      if (priceRange[1] < 5000) {
        params.append('max_price', priceRange[1].toString());
      }

      const response = await apiFetch(`/services/search?${params.toString()}`);
      
      if (response.success) {
        setServices(response.data || []);
        setTotalPages(Math.ceil((response.total || 0) / 12));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL();
    setCurrentPage(1);
    loadServices();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 5000]);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            fontWeight={700}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(135deg, rgb(129, 39, 85), rgba(129, 39, 85, 0.7))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Tous nos services
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Découvrez une large gamme de services pour tous vos besoins
          </Typography>
        </Box>

        {/* Barre de recherche principale */}
        <Paper 
          component="form" 
          onSubmit={handleSearch}
          className="glass-card"
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(129, 39, 85, 0.1)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher des services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgb(129, 39, 85)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <ClearIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Catégorie"
                  sx={{
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(129, 39, 85, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(129, 39, 85)',
                    },
                  }}
                >
                  <MenuItem value="">Toutes les catégories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
                    fontWeight: 600
                  }}
                >
                  Rechercher
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderRadius: 3,
                    borderColor: 'rgb(129, 39, 85)',
                    color: 'rgb(129, 39, 85)',
                    '&:hover': {
                      borderColor: 'rgb(129, 39, 85)',
                      backgroundColor: 'rgba(129, 39, 85, 0.05)'
                    }
                  }}
                >
                  <FilterIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtres avancés */}
        {showFilters && (
          <Fade in={showFilters}>
            <Paper 
              className="glass-card"
              sx={{ 
                p: 3, 
                mb: 4,
                background: 'rgba(129, 39, 85, 0.02)',
                border: '1px solid rgba(129, 39, 85, 0.1)'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography gutterBottom fontWeight={600}>
                    Fourchette de prix (DH)
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    step={50}
                    sx={{
                      color: 'rgb(129, 39, 85)',
                      '& .MuiSlider-thumb': {
                        backgroundColor: 'rgb(129, 39, 85)',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'rgb(129, 39, 85)',
                      },
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption">{priceRange[0]} DH</Typography>
                    <Typography variant="caption">{priceRange[1]} DH</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Trier par</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Trier par"
                    >
                      <MenuItem value="created_at">Date de création</MenuItem>
                      <MenuItem value="price">Prix</MenuItem>
                      <MenuItem value="title">Nom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Ordre</InputLabel>
                    <Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      label="Ordre"
                    >
                      <MenuItem value="asc">Croissant</MenuItem>
                      <MenuItem value="desc">Décroissant</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{
                      height: 56,
                      borderColor: 'rgb(129, 39, 85)',
                      color: 'rgb(129, 39, 85)',
                      '&:hover': {
                        borderColor: 'rgb(129, 39, 85)',
                        backgroundColor: 'rgba(129, 39, 85, 0.05)'
                      }
                    }}
                  >
                    Effacer
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}

        {/* Résultats */}
        <Box mb={4}>
          <Typography variant="h6" color="text.secondary">
            {loading ? 'Chargement...' : `${services.length} service${services.length > 1 ? 's' : ''} trouvé${services.length > 1 ? 's' : ''}`}
          </Typography>
        </Box>

        {/* Grille de services */}
        <Grid container spacing={4}>
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ServiceCardSkeleton />
              </Grid>
            ))
          ) : services.length > 0 ? (
            services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                <Fade in timeout={600 + (index * 100)}>
                  <Card 
                    className="glass-card"
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-8px)', 
                        boxShadow: '0 20px 60px rgba(129, 39, 85, 0.15)' 
                      }
                    }}
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image="https://www.50-et-plus.fr/wp-content/uploads/2024/06/voyage-organise-pour-personnes-seules-de-70-ans-profitez-de-vos-vacances-600x336.jpg.webp"
                        alt={service.title || service.name}
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Typography variant="caption" fontWeight={600}>
                          4.8
                        </Typography>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={700}
                        sx={{ 
                          mb: 1.5,
                          color: 'rgb(129, 39, 85)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '3.6em'
                        }}
                      >
                        {service.title || service.name}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip 
                          size="small"
                          label={service.category?.name || 'Service'} 
                          sx={{ 
                            backgroundColor: 'rgba(129, 39, 85, 0.1)',
                            color: 'rgb(129, 39, 85)',
                            fontWeight: 600
                          }} 
                        />
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {service.duration || '2h'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        fontWeight={700}
                        sx={{ color: 'rgb(129, 39, 85)' }}
                      >
                        {service.price ? `${service.price} DH` : 'Sur devis'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Aucun service trouvé
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Essayez de modifier vos critères de recherche
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={clearFilters}
                  sx={{
                    background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)'
                  }}
                >
                  Effacer les filtres
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgb(129, 39, 85)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(129, 39, 85, 0.8)',
                    }
                  }
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ServicesPage;
