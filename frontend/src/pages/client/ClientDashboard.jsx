import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Avatar
} from '@mui/material';
import {
  EventNote,
  Star,
  LocationOn,
  AccessTime,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { getUserFromStorage } from '../../utils/storage';
import apiFetch from '../../api/apiFetch';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData && userData.role === 'client') {
      setUser(userData);
      loadClientData(userData.id);
    }
  }, []);

  const loadClientData = async (userId) => {
    try {
      setLoading(true);
      
      // Charger les réservations du client
      const reservationsResponse = await apiFetch(`/user-reservations/${userId}`);
      setReservations(reservationsResponse.reservations);

      // Charger les services disponibles
      const servicesResponse = await apiFetch('/services');
      setAvailableServices(servicesResponse.data?.data?.slice(0, 6) || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      await apiFetch(`/reservations/cancel/${selectedReservation.id}`, {
        method: 'POST'
      });

      setOpenCancelDialog(false);
      setSelectedReservation(null);
      loadClientData(user.id);
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
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

  const canCancelReservation = (reservationDate) => {
    const reservation = new Date(reservationDate);
    const now = new Date();
    const daysDifference = (reservation - now) / (1000 * 60 * 60 * 24);
    return daysDifference >= 3;
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Client
        </Typography>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const totalSpent = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, rgb(129, 39, 85), rgba(129, 39, 85, 0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center'
        }}
      >
        Bonjour, {user.name}!
      </Typography>

      {/* Statistiques Client */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="glass-card animate-fade-in-up"
            sx={{ 
              background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
              boxShadow: '0 8px 32px rgba(129, 39, 85, 0.3)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(129, 39, 85, 0.4)',
              }
            }}
          >
            <CardContent sx={{ color: 'white', textAlign: 'center', p: 3 }}>
              <EventNote sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {reservations.length}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Total Réservations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="glass-card animate-fade-in-up"
            sx={{ 
              background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, rgba(129, 39, 85, 0.7) 100%)',
              boxShadow: '0 8px 32px rgba(129, 39, 85, 0.25)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(129, 39, 85, 0.35)',
              }
            }}
          >
            <CardContent sx={{ color: 'white', textAlign: 'center', p: 3 }}>
              <Star sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {confirmedReservations}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Confirmées
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="glass-card animate-fade-in-up"
            sx={{ 
              background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.8) 0%, rgba(129, 39, 85, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(129, 39, 85, 0.2)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(129, 39, 85, 0.3)',
              }
            }}
          >
            <CardContent sx={{ color: 'white', textAlign: 'center', p: 3 }}>
              <AccessTime sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {pendingReservations}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                En Attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="glass-card animate-fade-in-up"
            sx={{ 
              background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.7) 0%, rgba(129, 39, 85, 0.5) 100%)',
              boxShadow: '0 8px 32px rgba(129, 39, 85, 0.15)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(129, 39, 85, 0.25)',
              }
            }}
          >
            <CardContent sx={{ color: 'white', textAlign: 'center', p: 3 }}>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {totalSpent.toFixed(0)} DH
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Total Dépensé
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services Recommandés */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Services Recommandés
        </Typography>
        
        <Grid container spacing={3}>
          {availableServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                {service.images && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`/storage/${JSON.parse(service.images)[0]}`}
                    alt={service.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {service.description?.substring(0, 100)}...
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn color="action" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{service.location}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTime color="action" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{service.duration} min</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {service.price} DH
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        }
                      }}
                    >
                      Réserver
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mes Réservations */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Mes Réservations
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Service</strong></TableCell>
                <TableCell><strong>Agence</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Heure</strong></TableCell>
                <TableCell><strong>Montant</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {reservation.service?.title?.charAt(0) || 'S'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {reservation.service?.title || 'Service supprimé'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.service?.location}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{reservation.service?.agency?.name || 'N/A'}</TableCell>
                  <TableCell>{reservation.reservation_date}</TableCell>
                  <TableCell>{reservation.start_time}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {reservation.total_price} DH
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {reservation.status === 'pending' && canCancelReservation(reservation.reservation_date) && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setOpenCancelDialog(true);
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                    {reservation.status === 'confirmed' && (
                      <Rating value={4.5} size="small" readOnly />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {reservations.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              Aucune réservation trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Commencez par explorer nos services
            </Typography>
            <Button variant="contained" href="/services">
              Découvrir les Services
            </Button>
          </Box>
        )}
      </Paper>

      {/* Dialog Annulation */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir annuler cette réservation ?
          </Typography>
          {selectedReservation && (
            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="body2"><strong>Service:</strong> {selectedReservation.service?.title}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {selectedReservation.reservation_date}</Typography>
              <Typography variant="body2"><strong>Montant:</strong> {selectedReservation.total_price} DH</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>
            Fermer
          </Button>
          <Button onClick={handleCancelReservation} color="error" variant="contained">
            Confirmer l'annulation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDashboard;
