import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Skeleton,
  Alert,
  Snackbar,
  Badge
} from '@mui/material';
import {
  Event,
  Person,
  Euro,
  Visibility,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getReservations, 
  confirmReservation, 
  cancelReservation, 
  getReservationStats 
} from '../../api/reservations';

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info'
};

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée'
};

const AgencyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reservationsResponse, statsResponse] = await Promise.all([
        getReservations(filter !== 'all' ? { status: filter } : {}),
        getReservationStats()
      ]);
      
      setReservations(reservationsResponse.data || []);
      setStats(statsResponse.stats || {});
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      showSnackbar('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleConfirm = async (reservationId) => {
    try {
      await confirmReservation(reservationId);
      showSnackbar('Réservation confirmée avec succès');
      loadData();
    } catch (error) {
      showSnackbar('Erreur lors de la confirmation', 'error');
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      await cancelReservation(reservationId);
      showSnackbar('Réservation annulée avec succès');
      loadData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'annulation', 'error');
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDetailDialog(true);
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Gestion des Réservations
        </Typography>
        <Badge badgeContent={stats.pending || 0} color="warning">
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={() => setFilter('pending')}
          >
            En attente
          </Button>
        </Badge>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#e3f2fd', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {stats.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total réservations
                  </Typography>
                </Box>
                <Event sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#fff3e0', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={800} color="warning.main">
                    {stats.pending || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#e8f5e8', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={800} color="success.main">
                    {stats.confirmed || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmées
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#f3e5f5', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={800} color="secondary.main">
                    {stats.revenue ? `${stats.revenue}€` : '0€'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenus
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Box mb={3}>
        <TextField
          select
          label="Filtrer par statut"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Toutes</MenuItem>
          <MenuItem value="pending">En attente</MenuItem>
          <MenuItem value="confirmed">Confirmées</MenuItem>
          <MenuItem value="cancelled">Annulées</MenuItem>
          <MenuItem value="completed">Terminées</MenuItem>
        </TextField>
      </Box>

      {/* Liste des réservations */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                  <TableCell>Client</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date & Heure</TableCell>
                  <TableCell>Personnes</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                      <TableCell><Skeleton height={60} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box py={6}>
                        <Typography variant="h6" color="text.secondary" mb={1}>
                          Aucune réservation trouvée
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Les nouvelles réservations apparaîtront ici
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} hover sx={{ 
                      '&:hover': { backgroundColor: '#f8f9fa' },
                      cursor: 'pointer'
                    }}>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {reservation.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {reservation.user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reservation.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={reservation.service?.images?.[0] 
                              ? `http://localhost:8000/storage/${reservation.service.images[0]}`
                              : undefined
                            }
                            sx={{ mr: 2 }}
                          >
                            {reservation.service?.title?.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {reservation.service?.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Typography variant="body2" fontWeight={600}>
                          {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reservation.start_time ? 
                            new Date(reservation.start_time).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Box display="flex" alignItems="center">
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {reservation.number_of_people}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {reservation.total_price}€
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Commission: {reservation.commission_amount}€
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleViewDetails(reservation)}>
                        <Chip
                          label={statusLabels[reservation.status]}
                          color={statusColors[reservation.status]}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(reservation)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          {reservation.status === 'pending' && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleConfirm(reservation.id)}
                                sx={{ color: 'success.main' }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleCancel(reservation.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de détails */}
      <Dialog 
        open={detailDialog} 
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Détails de la réservation
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  CLIENT
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2 }}>
                    {selectedReservation.user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedReservation.user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReservation.user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  SERVICE
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  {selectedReservation.service?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {selectedReservation.service?.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  DATE ET HEURE
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(selectedReservation.reservation_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedReservation.start_time && 
                    `À ${new Date(selectedReservation.start_time).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`
                  }
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  DÉTAILS
                </Typography>
                <Typography variant="body1">
                  {selectedReservation.number_of_people} personne(s)
                </Typography>
                <Typography variant="body1" color="primary.main" fontWeight={700}>
                  {selectedReservation.total_price}€
                </Typography>
              </Grid>
              
              {selectedReservation.special_requests && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    DEMANDES SPÉCIALES
                  </Typography>
                  <Typography variant="body2">
                    {selectedReservation.special_requests}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>
            Fermer
          </Button>
          {selectedReservation?.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  handleConfirm(selectedReservation.id);
                  setDetailDialog(false);
                }}
                color="success"
                variant="contained"
              >
                Confirmer
              </Button>
              <Button 
                onClick={() => {
                  handleCancel(selectedReservation.id);
                  setDetailDialog(false);
                }}
                color="error"
                variant="outlined"
              >
                Annuler
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgencyReservations;
