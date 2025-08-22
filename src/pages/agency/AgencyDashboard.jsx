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
import { apiFetch } from '../../api/apiFetch';

const AgencyDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    max_participants: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData && userData.role === 'agency') {
      setUser(userData);
      loadDashboardData(userData.agency_id);
    }
  }, []);

  const loadDashboardData = async (agencyId) => {
    try {
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
    }
  };

  const handleCreateService = async () => {
    try {
      const serviceData = {
        ...newService,
        agency_id: user.agency_id,
        category_id: 1 // À adapter selon vos catégories
      };

      await apiFetch('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });

      setSnackbar({
        open: true,
        message: 'Service créé avec succès',
        severity: 'success'
      });

      setOpenServiceDialog(false);
      setNewService({
        title: '',
        description: '',
        price: '',
        location: '',
        duration: '',
        max_participants: ''
      });
      
      loadDashboardData(user.agency_id);
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création du service',
        severity: 'error'
      });
    }
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

      loadDashboardData(user.agency_id);
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
      loadDashboardData(user.agency_id);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Agence - {user.name}
      </Typography>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
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
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
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
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
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
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
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
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
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
