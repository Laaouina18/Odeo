import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp,
  EventNote,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

// Professional Fresh Color Palette
const PRIMARY_COLOR = '#1e3c72';
const SECONDARY_COLOR = '#2a5298';
const VIOLET_BLUE = '#667eea';
const VIOLET_PURPLE = '#764ba2';
const ACCENT_RED = '#ff4d4f';
import { getUserFromStorage } from '../../utils/storage';
import { DashboardSkeleton, StatsCardSkeleton } from '../../components/SkeletonLoader.jsx';
import apiFetch from '../../api/apiFetch';

const AgencyDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    max_participants: '',
    dates: [],
    category_id: '',
    status: 'active'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData && userData.role === 'agency') {
      setUser(userData);
      // Récupérer agency_id directement depuis le localStorage
      const agencyId = localStorage.getItem('agency_id') || userData.id;
      console.log('=== INITIALISATION DASHBOARD ===');
      console.log('userData:', userData);
      console.log('agency_id récupéré:', agencyId);
      loadDashboardData(agencyId);
    }
  }, []);

  const loadDashboardData = async (agencyId) => {
    try {
      setLoading(true);
      
      // Charger les catégories
      const categoriesResponse = await apiFetch('/categories');
      setCategories(categoriesResponse.data || categoriesResponse.categories || []);

      // Charger les statistiques
      const statsResponse = await apiFetch(`/agency-stats/${agencyId}`);
      setStats(statsResponse.stats);

      // Charger les services
      const servicesResponse = await apiFetch(`/agency-services/${agencyId}`);
      setServices(servicesResponse.services);

      // Charger les réservations
      const reservationsResponse = await apiFetch(`/agency-reservations/${agencyId}`);
      setReservations(reservationsResponse.reservations);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des données',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    try {
      // Récupérer les données utilisateur depuis le localStorage
      const userData = getUserFromStorage();
      const agencyId = localStorage.getItem('agency_id'); // Récupérer agency_id directement
      
      console.log('=== VÉRIFICATION DES DONNÉES ===');
      console.log('userData:', userData);
      console.log('agency_id depuis localStorage:', agencyId);
      console.log('Contenu complet du localStorage:', {
        token: localStorage.getItem('token'),
        agency_id: localStorage.getItem('agency_id'),
        user_id: localStorage.getItem('user_id'),
        role: localStorage.getItem('role')
      });
      
      // Validation et formatage des dates
      const formattedDates = newService.dates
        .filter(date => date.trim() !== '') // Supprimer les dates vides
        .map(date => {
          const cleanDate = date.trim();
          // Vérifier si la date est au format Y-m-d
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(cleanDate)) {
            throw new Error(`Format de date invalide: ${cleanDate}. Utilisez le format YYYY-MM-DD`);
          }
          return cleanDate;
        });

      console.log('Dates formatées:', formattedDates);
      
      const serviceData = {
        title: newService.title,
        description: newService.description,
        price: parseFloat(newService.price),
        location: newService.location,
        duration: parseInt(newService.duration),
        max_participants: parseInt(newService.max_participants),
        dates: formattedDates,
        category_id: parseInt(newService.category_id) || 1,
        status: newService.status,
        agency_id: parseInt(agencyId) || userData.id // Utiliser agency_id du localStorage ou user.id
      };

      console.log('Données à envoyer au serveur:', serviceData);
      console.log('Token utilisateur:', localStorage.getItem('token'));
      console.log('Données utilisateur:', userData);

      const endpoint = isEditing ? `/services/${editingService.id}` : '/services';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await apiFetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });

      setSnackbar({
        open: true,
        message: isEditing ? 'Service modifié avec succès' : 'Service créé avec succès',
        severity: 'success'
      });

      setOpenServiceDialog(false);
      setNewService({
        title: '',
        description: '',
        price: '',
        location: '',
        duration: '',
        max_participants: '',
        dates: [],
        category_id: '',
        status: 'active'
      });
      setIsEditing(false);
      setEditingService(null);
      
      loadDashboardData(localStorage.getItem('agency_id') || user.id);
    } catch (error) {
      console.error('=== ERREUR COMPLÈTE LORS DE LA CRÉATION/MODIFICATION DU SERVICE ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Log des données envoyées
      console.error('=== DONNÉES ENVOYÉES ===');
      const agencyIdUsed = localStorage.getItem('agency_id') || getUserFromStorage().id;
      console.error({
        title: newService.title,
        description: newService.description,
        price: parseFloat(newService.price),
        location: newService.location,
        duration: parseInt(newService.duration),
        max_participants: parseInt(newService.max_participants),
        dates: newService.dates,
        category_id: parseInt(newService.category_id) || 1,
        status: newService.status,
        agency_id: parseInt(agencyIdUsed)
      });
      
      // Afficher les erreurs détaillées du backend
      let errorMessage = isEditing ? 'Erreur lors de la modification du service' : 'Erreur lors de la création du service';
      
      console.error('=== VÉRIFICATION DE LA RÉPONSE D\'ERREUR ===');
      console.error('error.response existe?', !!error.response);
      console.error('error.response:', error.response);
      
      if (error.response && error.response.data) {
        console.error('=== RÉPONSE D\'ERREUR DU SERVEUR ===');
        console.error('Statut:', error.response.status);
        console.error('Données complètes:', error.response.data);
        
        if (error.response.data.errors) {
          // Erreurs de validation Laravel
          console.error('=== ERREURS DE VALIDATION LARAVEL ===');
          console.error('Erreurs brutes:', error.response.data.errors);
          
          const validationErrors = Object.values(error.response.data.errors).flat();
          console.error('Erreurs formatées:', validationErrors);
          errorMessage = validationErrors.join(', ');
        } else if (error.response.data.message) {
          console.error('=== MESSAGE D\'ERREUR DU SERVEUR ===');
          console.error('Message:', error.response.data.message);
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        console.error('=== MESSAGE D\'ERREUR CLIENT ===');
        console.error('Message:', error.message);
        errorMessage = error.message;
      }
      
      console.error('=== MESSAGE FINAL AFFICHÉ ===');
      console.error('Message:', errorMessage);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsEditing(true);
    setNewService({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      location: service.location || '',
      duration: service.duration?.toString() || '',
      max_participants: service.max_participants?.toString() || '',
      dates: service.dates || [],
      category_id: service.category_id?.toString() || '',
      status: service.status || 'active'
    });
    setOpenServiceDialog(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await apiFetch(`/services/${serviceId}`, {
        method: 'DELETE'
      });

      setSnackbar({
        open: true,
        message: 'Service supprimé avec succès',
        severity: 'success'
      });

      loadDashboardData(localStorage.getItem('agency_id') || user.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du service',
        severity: 'error'
      });
    }
  };

  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
    setIsEditing(false);
    setEditingService(null);
    setNewService({
      title: '',
      description: '',
      price: '',
      location: '',
      duration: '',
      max_participants: '',
      dates: [],
      category_id: '',
      status: 'active'
    });
  };

  const handleConfirmReservation = async (reservationId) => {
    try {
      await apiFetch(`/agency-reservations/${reservationId}/confirm`, {
        method: 'POST'
      });

      setSnackbar({
        open: true,
        message: 'Réservation confirmée avec succès',
        severity: 'success'
      });

      loadDashboardData(localStorage.getItem('agency_id') || user.id);
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la confirmation',
        severity: 'error'
      });
    }
  };

  const handleCancelReservation = async (reservationId, reason) => {
    try {
      await apiFetch(`/agency-reservations/${reservationId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ cancellation_reason: reason })
      });

      setSnackbar({
        open: true,
        message: 'Réservation annulée avec succès',
        severity: 'success'
      });

      setOpenReservationDialog(false);
      setSelectedReservation(null);
      loadDashboardData(localStorage.getItem('agency_id') || user.id);
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'annulation',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  // Afficher le skeleton pendant le chargement des données
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <Box 
      sx={{ 
        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 25%, ${VIOLET_BLUE} 50%, ${VIOLET_PURPLE} 75%, ${PRIMARY_COLOR} 100%)`,
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        minHeight: '100vh', 
        p: 3 
      }}
    >
      <Box maxWidth="lg" mx="auto">
        {/* En-tête professionnel */}
        <Box 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            p: 4,
            mb: 4,
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, white, rgba(255, 255, 255, 0.8))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            🏢 Dashboard Agence
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontWeight: 600 
            }}
          >
            Bienvenue {user.name} ! ✨
          </Typography>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
              borderRadius: 3,
              boxShadow: `0 8px 32px ${PRIMARY_COLOR}30`,
              transition: 'all 0.3s ease',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${PRIMARY_COLOR}40`
              }
            }}>
              <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.total_reservations || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Total Réservations
                    </Typography>
                  </Box>
                  <EventNote sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
              borderRadius: 3,
              boxShadow: `0 8px 32px ${VIOLET_BLUE}30`,
              transition: 'all 0.3s ease',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${VIOLET_BLUE}40`
              }
            }}>
              <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.confirmed_reservations || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Confirmées
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
              borderRadius: 3,
              boxShadow: `0 8px 32px ${PRIMARY_COLOR}25`,
              transition: 'all 0.3s ease',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${PRIMARY_COLOR}35`
              }
            }}>
              <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.total_revenue ? `${stats.total_revenue} DH` : '0 DH'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Chiffre d'affaires
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${SECONDARY_COLOR})`,
              borderRadius: 3,
              boxShadow: `0 8px 32px ${VIOLET_PURPLE}25`,
              transition: 'all 0.3s ease',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${VIOLET_PURPLE}35`
              }
            }}>
              <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {services.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Services Actifs
                    </Typography>
                  </Box>
                  <ViewIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Services */}
        <Paper sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(30, 60, 114, 0.08)',
          p: 3, 
          mb: 4 
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              📋 Mes Services
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenServiceDialog(true)}
              sx={{
                background: `linear-gradient(45deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                color: 'white',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                boxShadow: `0 8px 25px ${VIOLET_BLUE}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `linear-gradient(45deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 35px ${VIOLET_BLUE}60`
                }
              }}
            >
              ✨ Nouveau Service
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Nom</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Prix</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Localisation</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Statut</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow 
                    key={service.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f8fafc' },
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {service.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {service.price} DH
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 500 }}>
                        {service.location}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Chip
                        label={service.status === 'active' ? 'Actif' : 'Inactif'}
                        color={service.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box display="flex" gap={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditService(service)}
                          sx={{
                            color: '#f59e0b',
                            backgroundColor: '#fef3c7',
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: '#fde68a',
                              transform: 'scale(1.1)'
                            }
                          }}
                          title="Modifier le service"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteService(service.id)}
                          sx={{
                            color: ACCENT_RED,
                            backgroundColor: `${ACCENT_RED}10`,
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: `${ACCENT_RED}20`,
                              transform: 'scale(1.1)'
                            }
                          }}
                          title="Supprimer le service"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Réservations */}
        <Paper sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(30, 60, 114, 0.08)',
          p: 3 
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2
            }}
          >
            📊 Réservations Récentes
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8fafc' }}>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Client</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Service</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Montant</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Statut</strong>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow 
                    key={reservation.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f8fafc' },
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {reservation.user ? reservation.user.name : reservation.guest_name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 500 }}>
                        {reservation.service?.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 500 }}>
                        {reservation.reservation_date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {reservation.total_price} DH
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Chip
                        label={getStatusLabel(reservation.status)}
                        color={getStatusColor(reservation.status)}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      {reservation.status === 'pending' && (
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            onClick={() => handleConfirmReservation(reservation.id)}
                            sx={{
                              background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: 2,
                              textTransform: 'none',
                              boxShadow: `0 4px 16px ${VIOLET_BLUE}40`,
                              '&:hover': {
                                background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                                transform: 'translateY(-1px)',
                                boxShadow: `0 6px 20px ${VIOLET_BLUE}50`
                              }
                            }}
                          >
                            ✅ Confirmer
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setOpenReservationDialog(true);
                            }}
                            sx={{
                              background: ACCENT_RED,
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                background: '#dc2626',
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            ❌ Annuler
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialog Nouveau Service */}
        <Dialog 
          open={openServiceDialog} 
          onClose={() => setOpenServiceDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(30, 60, 114, 0.12)'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              color: '#1f2937', 
              fontWeight: 700, 
              fontSize: '1.25rem',
              borderBottom: '1px solid #e5e7eb',
              pb: 2
            }}
          >
            {isEditing ? '✏️ Modifier le Service' : '✨ Créer un Nouveau Service'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du service"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prix (DH)"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Durée (minutes)"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Localisation"
                  value={newService.location}
                  onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Participants max"
                  type="number"
                  value={newService.max_participants}
                  onChange={(e) => setNewService({ ...newService, max_participants: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dates disponibles (format YYYY-MM-DD, séparées par des virgules)"
                  placeholder="2025-08-25, 2025-08-26, 2025-08-27"
                  helperText="Utilisez le format YYYY-MM-DD (ex: 2025-08-25)"
                  value={newService.dates.join(', ')}
                  onChange={(e) => {
                    const datesArray = e.target.value.split(',').map(date => date.trim()).filter(date => date);
                    setNewService({ ...newService, dates: datesArray });
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Catégorie"
                  value={newService.category_id}
                  onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Statut"
                  value={newService.status}
                  onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { 
                      color: '#6b7280',
                      '&.Mui-focused': { color: VIOLET_BLUE }
                    }
                  }}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button 
              onClick={handleCloseServiceDialog}
              sx={{ 
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f3f4f6' }
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateService} 
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`
                }
              }}
            >
              {isEditing ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Annulation Réservation */}
        <Dialog 
          open={openReservationDialog} 
          onClose={() => setOpenReservationDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(30, 60, 114, 0.12)'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              color: '#1f2937', 
              fontWeight: 700, 
              fontSize: '1.25rem',
              borderBottom: '1px solid #e5e7eb',
              pb: 2
            }}
          >
            ❌ Annuler la Réservation
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Raison de l'annulation"
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#9ca3af' },
                  '&.Mui-focused fieldset': { borderColor: ACCENT_RED, borderWidth: 2 }
                },
                '& .MuiInputLabel-root': { 
                  color: '#6b7280',
                  '&.Mui-focused': { color: ACCENT_RED }
                }
              }}
              onChange={(e) => setSelectedReservation({ 
                ...selectedReservation, 
                cancellation_reason: e.target.value 
              })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button 
              onClick={() => setOpenReservationDialog(false)}
              sx={{ 
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f3f4f6' }
              }}
            >
              Fermer
            </Button>
            <Button 
              onClick={() => handleCancelReservation(
                selectedReservation?.id, 
                selectedReservation?.cancellation_reason
              )}
              variant="contained"
              sx={{
                background: ACCENT_RED,
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: '#dc2626'
                }
              }}
            >
              Confirmer l'annulation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              background: snackbar.severity === 'success' 
                ? 'rgba(76, 175, 80, 0.15)' 
                : 'rgba(244, 67, 54, 0.15)',
              border: snackbar.severity === 'success' 
                ? '1px solid rgba(76, 175, 80, 0.3)' 
                : '1px solid rgba(244, 67, 54, 0.3)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AgencyDashboard;
