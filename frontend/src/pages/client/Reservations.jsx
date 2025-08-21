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
  Snackbar
} from '@mui/material';
import {
  Event,
  Person,
  LocationOn,
  Euro,
  Edit,
  Delete,
  Visibility,
  Add,
  Cancel,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getReservations, deleteReservation, updateReservation } from '../../api/reservations';

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

const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadReservations();
  }, [filter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getReservations(params);
      setReservations(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      showSnackbar('Erreur lors du chargement des réservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditDialog(true);
  };

  const handleDelete = (reservation) => {
    setSelectedReservation(reservation);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteReservation(selectedReservation.id);
      showSnackbar('Réservation annulée avec succès');
      loadReservations();
      setDeleteDialog(false);
      setSelectedReservation(null);
    } catch (error) {
      showSnackbar('Erreur lors de l\'annulation', 'error');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await updateReservation(selectedReservation.id, formData);
      showSnackbar('Réservation mise à jour avec succès');
      loadReservations();
      setEditDialog(false);
      setSelectedReservation(null);
    } catch (error) {
      showSnackbar('Erreur lors de la mise à jour', 'error');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Mes Réservations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/services')}
          sx={{ borderRadius: 3 }}
        >
          Nouvelle Réservation
        </Button>
      </Box>

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

      {/* Statistiques rapides */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f8f9fa', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Event color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {reservations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total réservations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fff3cd', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {reservations.filter(r => r.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#d1e7dd', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f8d7da', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Cancel color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {reservations.filter(r => r.status === 'cancelled').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Annulées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des réservations */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
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
                      <TableCell><Skeleton height={40} /></TableCell>
                      <TableCell><Skeleton height={40} /></TableCell>
                      <TableCell><Skeleton height={40} /></TableCell>
                      <TableCell><Skeleton height={40} /></TableCell>
                      <TableCell><Skeleton height={40} /></TableCell>
                      <TableCell><Skeleton height={40} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        Aucune réservation trouvée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} hover>
                      <TableCell>
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
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {reservation.service?.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reservation.agency?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
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
                      <TableCell>
                        <Typography variant="body2">
                          {reservation.number_of_people} personne(s)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {reservation.total_price}€
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[reservation.status]}
                          color={statusColors[reservation.status]}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/reservations/${reservation.id}`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          {reservation.status === 'pending' && (
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(reservation)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          )}
                          {['pending', 'confirmed'].includes(reservation.status) && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(reservation)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
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

      {/* Dialog d'édition */}
      <EditReservationDialog
        open={editDialog}
        reservation={selectedReservation}
        onClose={() => setEditDialog(false)}
        onSubmit={handleEditSubmit}
      />

      {/* Dialog de suppression */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Annuler la réservation</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir annuler cette réservation ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
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
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Composant pour le dialog d'édition
const EditReservationDialog = ({ open, reservation, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    reservation_date: '',
    start_time: '',
    number_of_people: 1,
    special_requests: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        reservation_date: reservation.reservation_date?.split('T')[0] || '',
        start_time: reservation.start_time ? 
          new Date(reservation.start_time).toTimeString().slice(0, 5) : '',
        number_of_people: reservation.number_of_people || 1,
        special_requests: reservation.special_requests || ''
      });
    }
  }, [reservation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifier la réservation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de réservation"
                type="date"
                value={formData.reservation_date}
                onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Heure de début"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de personnes"
                type="number"
                value={formData.number_of_people}
                onChange={(e) => setFormData({ ...formData, number_of_people: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Demandes spéciales"
                multiline
                rows={3}
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClientReservations;
