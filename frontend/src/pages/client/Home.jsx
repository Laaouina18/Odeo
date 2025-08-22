import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Chip, 
  Stack, 
  Card, 
  CardMedia, 
  CardContent,
  Container,
  Fade,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocationOn, Search } from '@mui/icons-material';
import { getServices } from '../../api/services';
import { getCategories } from '../../api/categories';

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger les services et catégories au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices({ status: 'active' }), // Supprimer la limite pour récupérer tous les services
          getCategories()
        ]);
        setServices(servicesRes.data?.data || []);
        setCategories(categoriesRes.categories || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      {/* Hero Section */}
      <Box sx={{ 
        pt: 10, 
        pb: 8, 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Typography variant="h2" fontWeight={800} mb={2} sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Découvrez des expériences uniques
            </Typography>
          </Fade>
          <Fade in timeout={1500}>
            <Typography variant="h5" mb={4} sx={{ opacity: 0.9 }}>
              Voyage, aventure, détente... tout est sur Odeo !
            </Typography>
          </Fade>
          <Fade in timeout={2000}>
            <Paper component="form" onSubmit={handleSearch} sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              maxWidth: 500,
              margin: '0 auto'
            }}>
              <TextField
                placeholder="Rechercher un service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { border: 'none' } }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ ml: 1, borderRadius: 3, px: 3 }}
              >
                Rechercher
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Explorer par catégorie
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={selectedCategory === cat.name ? 'primary' : 'default'}
              onClick={() => handleCategoryClick(cat.name)}
              sx={{ 
                fontSize: 16, 
                px: 3, 
                py: 1,
                borderRadius: 8,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* All Services Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} mb={2} textAlign="center">
          Tous nos services
        </Typography>
        {!loading && services.length > 0 && (
          <Typography variant="body2" color="text.secondary" mb={4} textAlign="center">
            {services.length} service{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}
          </Typography>
        )}
        <Grid container spacing={4}>
          {loading ? (
            // Skeleton loading
            Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ borderRadius: 4 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            services.map((service) => (
              <Grid item xs={12} sm={6} md={3} key={service.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)' 
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/services/${service.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.images && service.images.length > 0
                      ? `http://localhost:8000/storage/${service.images[0]}` 
                      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
                    }
                    alt={service.title}
                    sx={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" fontWeight={700} mb={1} noWrap>
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      mb={2}
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {service.location || 'Lieu non spécifié'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {service.price} DH
                      </Typography>
                      <Chip 
                        label={service.category?.name || 'Autre'} 
                        size="small" 
                        color="secondary"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/direct-booking/${service.id}`);
                      }}
                      sx={{ 
                        borderRadius: 2, 
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Réserver directement
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        
        {!loading && services.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Aucun service disponible pour le moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Les agences peuvent ajouter leurs services via leur tableau de bord
            </Typography>
          </Box>
        )}
      </Container>

      {/* Statistics Section - Real data from backend */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={600} mb={6} textAlign="center">
            Pourquoi choisir Odeo ?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  {services.length}+
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Services disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Une large gamme d'activités pour tous les goûts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  {categories.length}+
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Catégories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Des expériences diversifiées dans tous les domaines
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  100%
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Sécurisé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Réservations et paiements entièrement sécurisés
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.default', py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 Odeo — Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
