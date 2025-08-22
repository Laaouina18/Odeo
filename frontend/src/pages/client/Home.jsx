import React, { useState, useEffect, useMemo } from 'react';
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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
  InputAdornment,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocationOn, 
  Search, 
  Close, 
  AccessTime, 
  Person, 
  Euro,
  Visibility,
  Phone,
  Email,
  Language
} from '@mui/icons-material';
import { getServices } from '../../api/services';
import { getCategories } from '../../api/categories';

const ITEMS_PER_PAGE = 12;
const PRIMARY_COLOR = 'rgb(129, 39, 85)';

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Charger les services et catégories au montage
  useEffect(() => {
    const loadData = async () => {
      try {
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

  // Filtrage et recherche instantanée
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = !search || 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        (service.location && service.location.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = !selectedCategory || 
        service.category?.name === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, search, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Réinitialiser la page lors du changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(selectedCategory === cat ? '' : cat);
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedService(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh">
      {/* Hero Section avec image de fond */}
      <Box sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 6, md: 10 }, 
        textAlign: 'center', 
        background: `linear-gradient(rgba(129, 39, 85, 0.8), rgba(129, 39, 85, 0.6)), url('https://www.50-et-plus.fr/wp-content/uploads/2024/06/voyage-organise-pour-personnes-seules-de-70-ans-profitez-de-vos-vacances-600x336.jpg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { md: 'fixed' },
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Typography 
              variant="h1" 
              fontWeight={900} 
              mb={3} 
              sx={{ 
                fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                lineHeight: 1.1
              }}
            >
              Découvrez des expériences
              <Box component="span" sx={{ color: '#ffd700', display: 'block' }}>
                inoubliables
              </Box>
            </Typography>
          </Fade>
          
          <Fade in timeout={1500}>
            <Typography 
              variant="h5" 
              mb={5} 
              sx={{ 
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Voyage, aventure, détente... Trouvez l'expérience parfaite qui vous correspond sur Odeo !
            </Typography>
          </Fade>

          <Fade in timeout={2000}>
            <Paper sx={{ 
              p: { xs: 1, md: 2 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center', 
              borderRadius: { xs: 3, md: 5 },
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              maxWidth: 600,
              margin: '0 auto',
              gap: { xs: 2, sm: 0 }
            }}>
              <TextField
                placeholder="Rechercher un service, une destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: PRIMARY_COLOR }} />
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    border: 'none',
                    '& fieldset': { border: 'none' }
                  }
                }}
              />
            </Paper>
          </Fade>

          {/* Statistiques en temps réel */}
          <Fade in timeout={2500}>
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={900} sx={{ color: '#ffd700' }}>
                  {services.length}+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Services</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={900} sx={{ color: '#ffd700' }}>
                  {categories.length}+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Catégories</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={900} sx={{ color: '#ffd700' }}>
                  24/7
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Support</Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Categories Section - Design amélioré */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          mb={2} 
          textAlign="center"
          sx={{ color: PRIMARY_COLOR }}
        >
          Explorer par catégorie
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={5} textAlign="center">
          Choisissez parmi nos catégories soigneusement sélectionnées
        </Typography>
        
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={selectedCategory === cat.name ? 'primary' : 'default'}
              onClick={() => handleCategoryClick(cat.name)}
              sx={{ 
                fontSize: { xs: 14, md: 16 }, 
                px: { xs: 2, md: 3 }, 
                py: { xs: 0.5, md: 1 },
                borderRadius: 50,
                minHeight: { xs: 36, md: 44 },
                backgroundColor: selectedCategory === cat.name ? PRIMARY_COLOR : 'transparent',
                borderColor: PRIMARY_COLOR,
                color: selectedCategory === cat.name ? 'white' : PRIMARY_COLOR,
                border: `2px solid ${PRIMARY_COLOR}`,
                '&:hover': { 
                  transform: 'translateY(-3px)', 
                  boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
                  backgroundColor: selectedCategory === cat.name ? PRIMARY_COLOR : `${PRIMARY_COLOR}10`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Services Section avec compteur et pagination */}
      <Box sx={{ bgcolor: '#fafafa' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight={700} 
                sx={{ color: PRIMARY_COLOR }}
              >
                Nos services
              </Typography>
              {!loading && (
                <Typography variant="body1" color="text.secondary">
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
                  {search && ` pour "${search}"`}
                  {selectedCategory && ` dans "${selectedCategory}"`}
                </Typography>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            {loading ? (
              // Skeleton loading bien structuré
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      height: 500,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Skeleton 
                      variant="rectangular" 
                      height={220}
                      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Skeleton variant="text" width="80%" height={32} />
                      <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                      <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
                      
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Skeleton variant="text" width="70%" height={18} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="text" width="30%" height={18} />
                      </Box>
                      
                      <Skeleton variant="rounded" width="100%" height={40} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              paginatedServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={service.id}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    height: 500,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    border: `1px solid #e0e0e0`,
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      boxShadow: `0 16px 40px ${PRIMARY_COLOR}25`,
                      borderColor: `${PRIMARY_COLOR}50`
                    }
                  }}
                  onClick={() => handleServiceClick(service)}
                  >
                    <Box position="relative" sx={{ height: 220, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={service.images && service.images.length > 0
                          ? `http://localhost:8000/storage/${service.images[0]}` 
                          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=220&fit=crop&auto=format'
                        }
                        alt={service.title}
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                      <Box
                        position="absolute"
                        top={12}
                        right={12}
                        sx={{
                          backgroundColor: PRIMARY_COLOR,
                          color: 'white',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}
                      >
                        {service.price} DH
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      p: 2.5, 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          mb={1.5}
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '3.2em',
                            lineHeight: 1.6,
                            fontSize: '1.1rem'
                          }}
                        >
                          {service.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          mb={2}
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '4.5em',
                            lineHeight: 1.5
                          }}
                        >
                          {service.description}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" mb={2}>
                          <LocationOn sx={{ fontSize: 16, color: PRIMARY_COLOR, mr: 0.5 }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {service.location || 'Lieu non spécifié'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Chip 
                            label={service.category?.name || 'Autre'} 
                            size="small" 
                            sx={{ 
                              backgroundColor: `${PRIMARY_COLOR}15`,
                              color: PRIMARY_COLOR,
                              borderRadius: 2,
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Box display="flex" alignItems="center">
                            <Visibility sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              Détails
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="medium"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/direct-booking/${service.id}`);
                          }}
                          sx={{ 
                            borderRadius: 2.5, 
                            fontWeight: 700,
                            textTransform: 'none',
                            backgroundColor: PRIMARY_COLOR,
                            py: 1.2,
                            '&:hover': {
                              backgroundColor: PRIMARY_COLOR,
                              filter: 'brightness(1.1)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          Réserver maintenant
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination 
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: PRIMARY_COLOR,
                    '&.Mui-selected': {
                      backgroundColor: PRIMARY_COLOR,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: PRIMARY_COLOR,
                        filter: 'brightness(1.1)'
                      }
                    }
                  }
                }}
              />
            </Box>
          )}
          
          {!loading && filteredServices.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" color="text.secondary" mb={2}>
                {search || selectedCategory ? 'Aucun service trouvé' : 'Aucun service disponible'}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                {search || selectedCategory 
                  ? 'Essayez de modifier vos critères de recherche' 
                  : 'Les agences peuvent ajouter leurs services via leur tableau de bord'
                }
              </Typography>
              {(search || selectedCategory) && (
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                  }}
                  sx={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                >
                  Effacer les filtres
                </Button>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Dialog détails du service */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ p: 0 }}>
              <Box position="relative">
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedService.images && selectedService.images.length > 0
                    ? `http://localhost:8000/storage/${selectedService.images[0]}` 
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop'
                  }
                  alt={selectedService.title}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  <Close />
                </IconButton>
                <Box
                  position="absolute"
                  bottom={16}
                  left={16}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    {selectedService.price} DH
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={700} mb={2} sx={{ color: PRIMARY_COLOR }}>
                {selectedService.title}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ fontSize: 20, color: PRIMARY_COLOR, mr: 1 }} />
                  <Typography variant="body1">
                    {selectedService.location || 'Lieu non spécifié'}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedService.category?.name || 'Autre'} 
                  sx={{ 
                    backgroundColor: `${PRIMARY_COLOR}15`,
                    color: PRIMARY_COLOR,
                    fontWeight: 600
                  }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight={600} mb={2}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.7}>
                {selectedService.description}
              </Typography>

              {selectedService.duration && (
                <Box display="flex" alignItems="center" mb={2}>
                  <AccessTime sx={{ fontSize: 20, color: PRIMARY_COLOR, mr: 1 }} />
                  <Typography variant="body1">
                    Durée: {selectedService.duration}
                  </Typography>
                </Box>
              )}

              {selectedService.max_participants && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ fontSize: 20, color: PRIMARY_COLOR, mr: 1 }} />
                  <Typography variant="body1">
                    Max participants: {selectedService.max_participants}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ 
                  borderColor: PRIMARY_COLOR, 
                  color: PRIMARY_COLOR,
                  mr: 2
                }}
              >
                Fermer
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseDialog();
                  navigate(`/direct-booking/${selectedService.id}`);
                }}
                sx={{ 
                  backgroundColor: PRIMARY_COLOR,
                  '&:hover': {
                    backgroundColor: PRIMARY_COLOR,
                    filter: 'brightness(1.1)'
                  }
                }}
              >
                Réserver maintenant
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Section Pourquoi Odeo - Redesignée */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          mb={3} 
          textAlign="center"
          sx={{ color: PRIMARY_COLOR }}
        >
          Pourquoi choisir Odeo ?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={6} textAlign="center" maxWidth={600} mx="auto">
          Une plateforme moderne et sécurisée pour découvrir et réserver vos expériences préférées
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={4}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: `${PRIMARY_COLOR}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h3" fontWeight={900} sx={{ color: PRIMARY_COLOR }}>
                  {services.length}+
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} mb={2}>
                Services disponibles
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                Une large gamme d'activités soigneusement sélectionnées pour tous les goûts et budgets
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={4}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: `${PRIMARY_COLOR}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h3" fontWeight={900} sx={{ color: PRIMARY_COLOR }}>
                  {categories.length}+
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} mb={2}>
                Catégories
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                Des expériences diversifiées dans tous les domaines pour satisfaire toutes vos envies
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={4}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: `${PRIMARY_COLOR}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Typography variant="h3" fontWeight={900} sx={{ color: PRIMARY_COLOR }}>
                  100%
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} mb={2}>
                Sécurisé
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                Réservations et paiements entièrement sécurisés avec une protection complète
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer amélioré */}
      <Box sx={{ 
        bgcolor: PRIMARY_COLOR, 
        color: 'white',
        py: { xs: 4, md: 6 }, 
        textAlign: 'center' 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={600} mb={2}>
            Odeo
          </Typography>
          <Typography variant="body1" mb={3} sx={{ opacity: 0.9 }}>
            Votre plateforme de réservation d'expériences uniques
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 Odeo — Tous droits réservés
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;