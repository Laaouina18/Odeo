import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Typography, 
  Button, 
  Chip,
  Avatar,
  Rating,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  People,
  Star,
  Share,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  CalendarToday,
  Phone,
  Email
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ServiceDetailSkeleton } from '../components/SkeletonLoader';
import apiFetch from '../api/apiFetch';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    participants: 1,
    message: ''
  });

  useEffect(() => {
    loadServiceDetail();
  }, [id]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      // Logique de réservation
      const response = await apiFetch('/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: id,
          ...bookingData
        })
      });
      
      if (response.success) {
        setBookingDialogOpen(false);
        // Rediriger vers la confirmation
        navigate(`/confirmation/${response.reservation_id}`);
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Ajouter/retirer des favoris
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.title || service?.name,
        text: service?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Service non trouvé
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/services')}
          sx={{ mt: 2 }}
        >
          Retour aux services
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header avec bouton retour */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(129, 39, 85, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(129, 39, 85, 0.2)'
              }
            }}
          >
            <ArrowBack sx={{ color: 'rgb(129, 39, 85)' }} />
          </IconButton>
          <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
            Détail du service
          </Typography>
          
          {/* Actions */}
          <Box display="flex" gap={1}>
            <IconButton onClick={handleFavoriteToggle} color="primary">
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={handleShare} color="primary">
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Contenu principal */}
          <Grid item xs={12} md={8}>
            <Card className="glass-card" sx={{ mb: 4 }}>
              {/* Image principale */}
              <CardMedia
                component="img"
                height={isMobile ? 250 : 400}
                image="https://www.50-et-plus.fr/wp-content/uploads/2024/06/voyage-organise-pour-personnes-seules-de-70-ans-profitez-de-vos-vacances-600x336.jpg.webp"
                alt={service.title || service.name}
                sx={{ 
                  objectFit: 'cover',
                  borderRadius: '16px 16px 0 0'
                }}
              />
              
              <CardContent sx={{ p: 4 }}>
                {/* Titre et badges */}
                <Box mb={3}>
                  <Typography 
                    variant="h3" 
                    fontWeight={700}
                    sx={{ 
                      mb: 2,
                      color: 'rgb(129, 39, 85)',
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    {service.title || service.name}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip 
                      label={service.category?.name || 'Service'} 
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip 
                      label={service.status === 'active' ? 'Disponible' : 'Indisponible'}
                      color={service.status === 'active' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  
                  {/* Note et avis */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={4.8} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      4.8/5 (127 avis)
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    lineHeight: 1.7,
                    fontSize: '1.1rem'
                  }}
                >
                  {service.description}
                </Typography>

                {/* Informations pratiques */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime sx={{ color: 'rgb(129, 39, 85)' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Durée
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {service.duration || '2h'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People sx={{ color: 'rgb(129, 39, 85)' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Participants max
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {service.max_participants || '10'} personnes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn sx={{ color: 'rgb(129, 39, 85)' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Localisation
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {service.location || 'À définir'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Informations sur l'agence */}
                <Typography variant="h5" fontWeight={600} mb={3}>
                  À propos du prestataire
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60,
                      bgcolor: 'rgb(129, 39, 85)'
                    }}
                  >
                    {service.agency?.agency_name?.charAt(0) || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {service.agency?.agency_name || 'Agence partenaire'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.agency?.agency_description || 'Description non disponible'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    size="small"
                    href={`tel:${service.agency?.agency_phone}`}
                    disabled={!service.agency?.agency_phone}
                  >
                    Appeler
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    size="small"
                    href={`mailto:${service.agency?.agency_email}`}
                    disabled={!service.agency?.agency_email}
                  >
                    Email
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar de réservation */}
          <Grid item xs={12} md={4}>
            <Card 
              className="glass-card"
              sx={{ 
                position: { md: 'sticky' },
                top: { md: 100 }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  {service.price ? `${service.price} DH` : 'Sur devis'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  par personne
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<CalendarToday />}
                  onClick={() => setBookingDialogOpen(true)}
                  sx={{ 
                    py: 2,
                    mb: 3,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, rgba(129, 39, 85, 0.7) 100%)',
                    }
                  }}
                >
                  Réserver maintenant
                </Button>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Réservation sécurisée • Annulation gratuite 48h avant
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog de réservation */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            Réserver "{service.title || service.name}"
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date souhaitée"
                type="date"
                fullWidth
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Heure préférée"
                type="time"
                fullWidth
                value={bookingData.time}
                onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Nombre de participants"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: service.max_participants || 10 }}
                value={bookingData.participants}
                onChange={(e) => setBookingData({...bookingData, participants: parseInt(e.target.value)})}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Message ou demandes spéciales"
                multiline
                rows={3}
                fullWidth
                value={bookingData.message}
                onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                placeholder="Informations complémentaires..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            color="inherit"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleBooking}
            variant="contained"
            sx={{ 
              px: 4,
              background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)'
            }}
          >
            Confirmer la réservation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceDetail;
