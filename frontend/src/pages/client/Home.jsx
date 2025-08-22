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
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocationOn, Search, Star, AccessTime } from '@mui/icons-material';
import { getServices } from '../../api/services';
import { getCategories } from '../../api/categories';
import { HomePageSkeleton, ServiceCardSkeleton } from '../../components/SkeletonLoader';

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Charger les services et catégories au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices({ status: 'active' }), 
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
    let params = '';
    if (search) params += `?q=${encodeURIComponent(search)}`;
    if (selectedCategory) params += (params ? '&' : '?') + `category=${encodeURIComponent(selectedCategory)}`;
    navigate(`/services${params}`);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    navigate(`/services?category=${encodeURIComponent(cat)}`);
  };

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 6, md: 10 }, 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.9) 100%)', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://www.50-et-plus.fr/wp-content/uploads/2024/06/voyage-organise-pour-personnes-seules-de-70-ans-profitez-de-vos-vacances-600x336.jpg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Typography 
              variant="h1" 
              fontWeight={800} 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff, #f8f9fa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Découvrez des expériences uniques
            </Typography>
          </Fade>
          
          <Fade in timeout={1500}>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.95, 
                mb: 5,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 500,
                textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
              }}
            >
              Voyage, aventure, détente... tout est sur Odeo !
            </Typography>
          </Fade>
          
          <Fade in timeout={2000}>
            <Paper 
              component="form" 
              onSubmit={handleSearch} 
              className="glass-card"
              sx={{ 
                p: { xs: 1.5, md: 2 }, 
                display: 'flex', 
                alignItems: 'center', 
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                maxWidth: 600,
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}
            >
              <TextField
                placeholder="Rechercher un service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgb(129, 39, 85)' }} />
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    border: 'none',
                    borderRadius: 3,
                    '& fieldset': { border: 'none' }
                  } 
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                sx={{ 
                  ml: { xs: 0, sm: 1 }, 
                  borderRadius: 3, 
                  px: 4,
                  py: { xs: 1.5, sm: 1 },
                  minWidth: { xs: '100%', sm: 'auto' },
                  background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                Rechercher
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Fade in timeout={2500}>
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h3" 
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
              Explorer par catégorie
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Trouvez exactement ce que vous recherchez
            </Typography>
          </Box>
        </Fade>
        
        <Fade in timeout={3000}>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={2} 
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            {categories.map((cat, index) => (
              <Chip
                key={cat.id}
                label={cat.name}
                color={selectedCategory === cat.name ? 'primary' : 'default'}
                onClick={() => handleCategoryClick(cat.name)}
                className="animate-fade-in-up"
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '1rem' }, 
                  px: { xs: 2, md: 3 }, 
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(129, 39, 85, 0.1)',
                  border: '1px solid rgba(129, 39, 85, 0.1)',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 25px rgba(129, 39, 85, 0.2)',
                    backgroundColor: selectedCategory === cat.name ? undefined : 'rgba(129, 39, 85, 0.05)'
                  },
                  transition: 'all 0.3s ease',
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </Box>
        </Fade>
      </Container>

      {/* All Services Section */}
      <Box sx={{ backgroundColor: 'rgba(129, 39, 85, 0.02)', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Fade in timeout={3500}>
            <Box textAlign="center" mb={6}>
              <Typography 
                variant="h3" 
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
                Nos services populaires
              </Typography>
              {services.length > 0 && (
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {services.length} service{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}
                </Typography>
              )}
            </Box>
          </Fade>
          
          <Grid container spacing={4}>
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ServiceCardSkeleton />
                </Grid>
              ))
            ) : (
              services.slice(0, 8).map((service, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                  <Fade in timeout={4000 + (index * 200)}>
                    <Card 
                      className="glass-card animate-fade-in-up"
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'translateY(-12px)', 
                          boxShadow: '0 20px 60px rgba(129, 39, 85, 0.15)' 
                        },
                        animationDelay: `${index * 0.1}s`
                      }}
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image="https://www.50-et-plus.fr/wp-content/uploads/2024/06/voyage-organise-pour-personnes-seules-de-70-ans-profitez-de-vos-vacances-600x336.jpg.webp"
                          alt={service.title}
                          sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
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
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
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
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4
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
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }} 
                          />
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              {service.duration || '2h'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          sx={{ 
                            color: 'rgb(129, 39, 85)',
                            fontSize: '1.2rem'
                          }}
                        >
                          {service.price ? `${service.price} DH` : 'Sur devis'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))
            )}
          </Grid>
          
          {services.length > 8 && (
            <Fade in timeout={5000}>
              <Box textAlign="center" mt={6}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{ 
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
                    boxShadow: '0 8px 32px rgba(129, 39, 85, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(129, 39, 85, 0.4)'
                    }
                  }}
                >
                  Voir tous les services
                </Button>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
    </Box>
  );
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
