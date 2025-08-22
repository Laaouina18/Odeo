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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Agence - {user.name}
      </Typography>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.4)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_reservations || 0}
                  </Typography>
                  <Typography variant="body2">
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
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, rgba(129, 39, 85, 0.7) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.25)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.35)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.confirmed_reservations || 0}
                  </Typography>
                  <Typography variant="body2">
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
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.8) 0%, rgba(129, 39, 85, 0.6) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.3)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_revenue ? `${stats.total_revenue} DH` : '0 DH'}
                  </Typography>
                  <Typography variant="body2">
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
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.7) 0%, rgba(129, 39, 85, 0.5) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.15)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.25)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {services.length || 0}
                  </Typography>
                  <Typography variant="body2">
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
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Mes Services
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenServiceDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, rgb(129, 39, 85) 30%, rgba(129, 39, 85, 0.8) 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, rgba(129, 39, 85, 0.9) 30%, rgb(129, 39, 85) 90%)',
              }
            }}
          >
            Nouveau Service
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Prix</strong></TableCell>
                <TableCell><strong>Localisation</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.title}</TableCell>
                  <TableCell>{service.price} DH</TableCell>
                  <TableCell>{service.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={service.status === 'active' ? 'Actif' : 'Inactif'}
                      color={service.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditService(service)}
                      title="Modifier le service"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteService(service.id)}
                      title="Supprimer le service"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Réservations */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Réservations Récentes
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Client</strong></TableCell>
                <TableCell><strong>Service</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Montant</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {reservation.user ? reservation.user.name : reservation.guest_name}
                  </TableCell>
                  <TableCell>{reservation.service?.title}</TableCell>
                  <TableCell>{reservation.reservation_date}</TableCell>
                  <TableCell>{reservation.total_price} DH</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {reservation.status === 'pending' && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleConfirmReservation(reservation.id)}
                          sx={{ mr: 1 }}
                        >
                          Confirmer
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setOpenReservationDialog(true);
                          }}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Nouveau Service */}
      <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer un Nouveau Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du service"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prix (DH)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Durée (minutes)"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={newService.location}
                onChange={(e) => setNewService({ ...newService, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Participants max"
                type="number"
                value={newService.max_participants}
                onChange={(e) => setNewService({ ...newService, max_participants: e.target.value })}
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
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateService} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Annulation Réservation */}
      <Dialog open={openReservationDialog} onClose={() => setOpenReservationDialog(false)}>
        <DialogTitle>Annuler la Réservation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Raison de l'annulation"
            sx={{ mt: 2 }}
            onChange={(e) => setSelectedReservation({ 
              ...selectedReservation, 
              cancellation_reason: e.target.value 
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReservationDialog(false)}>Fermer</Button>
          <Button 
            onClick={() => handleCancelReservation(
              selectedReservation?.id, 
              selectedReservation?.cancellation_reason
            )}
            color="error"
            variant="contained"
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgencyDashboard;
