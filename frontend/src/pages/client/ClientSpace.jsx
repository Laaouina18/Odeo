import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Person,
  Event,
  Download,
  Edit,
  Cancel,
  Visibility,
  LocalActivity,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { getUserReservations, cancelUserReservation, updateUserReservation } from '../../api/userReservations';
import { getUserFromStorage, isAuthenticated } from '../../utils/storage';

const ClientSpace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [editDialog, setEditDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser || !isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    loadUserReservations(currentUser.id);
  }, [navigate]);

  const loadUserReservations = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserReservations(userId);
      setReservations(response.reservations || []);
    } catch (error) {
      setError('Erreur lors du chargement des réservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const canModifyOrCancel = (reservationDate) => {
    const resDate = new Date(reservationDate);
    const now = new Date();
    const diffTime = resDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const handleEdit = (reservation) => {
    if (!canModifyOrCancel(reservation.reservation_date)) {
      setError('Modification impossible : moins de 3 jours avant la réservation');
      return;
    }
    
    setSelectedReservation(reservation);
    setEditData({
      reservation_date: reservation.reservation_date,
      start_time: new Date(reservation.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
      number_of_people: reservation.number_of_people,
      special_requests: reservation.special_requests || '',
      guest_name: reservation.guest_name || '',
      guest_phone: reservation.guest_phone || ''
    });
    setEditDialog(true);
  };

  const handleCancelRequest = (reservation) => {
    if (!canModifyOrCancel(reservation.reservation_date)) {
      setError('Annulation impossible : moins de 3 jours avant la réservation');
      return;
    }
    
    setSelectedReservation(reservation);
    setCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelUserReservation(selectedReservation.id);
      setSuccess('Réservation annulée avec succès');
      setCancelDialog(false);
      setSelectedReservation(null);
      loadUserReservations(user.id);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      await updateUserReservation(selectedReservation.id, editData);
      setSuccess('Réservation modifiée avec succès');
      setEditDialog(false);
      setSelectedReservation(null);
      loadUserReservations(user.id);
    } catch (error) {
      setError(error.message);
    }
  };

  const generatePDF = (reservation) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let currentY = margin;
    
    // En-tête
    pdf.setFontSize(24);
    pdf.setTextColor(25, 118, 210);
    pdf.text('ODEO', margin, currentY);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Plateforme de réservation d\'activités', margin, currentY + 8);
    
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text('FACTURE DE RÉSERVATION', pageWidth - 80, currentY);
    
    pdf.setFontSize(10);
    pdf.text(`N° ${reservation.id}`, pageWidth - 80, currentY + 8);
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 80, currentY + 15);
    
    currentY += 35;
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
    
    // Informations client
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('INFORMATIONS CLIENT', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const clientName = reservation.user?.name || reservation.guest_name;
    const clientEmail = reservation.user?.email || reservation.guest_email;
    const clientPhone = reservation.guest_phone;
    
    pdf.text(`Nom: ${clientName}`, margin, currentY);
    pdf.text(`Email: ${clientEmail}`, margin, currentY + 7);
    if (clientPhone) {
      pdf.text(`Téléphone: ${clientPhone}`, margin, currentY + 14);
      currentY += 21;
    } else {
      currentY += 14;
    }
    
    currentY += 10;
    
    // Détails réservation
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('DÉTAILS DE LA RÉSERVATION', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Service: ${reservation.service?.title}`, margin, currentY);
    pdf.text(`Agence: ${reservation.service?.agency?.name}`, margin, currentY + 7);
    pdf.text(`Date: ${new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}`, margin, currentY + 14);
    pdf.text(`Heure: ${new Date(reservation.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`, margin, currentY + 21);
    pdf.text(`Personnes: ${reservation.number_of_people}`, margin, currentY + 28);
    
    if (reservation.special_requests) {
      pdf.text(`Demandes: ${reservation.special_requests}`, margin, currentY + 35);
      currentY += 42;
    } else {
      currentY += 35;
    }
    
    currentY += 15;
    
    // Prix
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('RÉCAPITULATIF FINANCIER', margin, currentY);
    currentY += 15;
    
    pdf.setDrawColor(25, 118, 210);
    pdf.setLineWidth(1);
    pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 25);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const unitPrice = reservation.total_price / reservation.number_of_people;
    pdf.text(`Prix unitaire: ${unitPrice.toFixed(0)}€`, margin + 5, currentY + 5);
    pdf.text(`Quantité: ${reservation.number_of_people} personne(s)`, margin + 5, currentY + 12);
    
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text(`TOTAL: ${reservation.total_price}€`, pageWidth - 60, currentY + 12);
    
    currentY += 35;
    
    // Statut
    pdf.setFontSize(12);
    pdf.setTextColor(46, 125, 50);
    pdf.text(`✓ STATUT: ${getStatusText(reservation.status).toUpperCase()}`, margin, currentY);
    
    pdf.save(`facture-reservation-${reservation.id}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Box maxWidth="lg" mx="auto">
        {/* En-tête */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Person sx={{ fontSize: 40, color: 'white', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight={800} color="white">
                  Espace Client
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Bienvenue {user?.name} !
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                '&:hover': { bgcolor: 'grey.100' },
                borderRadius: 3,
                px: 3
              }}
            >
              Nouvelle réservation
            </Button>
          </Box>
        </Paper>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Statistiques rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', borderRadius: 3 }}>
              <CardContent>
                <LocalActivity sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {reservations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total réservations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', borderRadius: 3 }}>
              <CardContent>
                <CalendarToday sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confirmées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', borderRadius: 3 }}>
              <CardContent>
                <Event sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {reservations.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En attente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', borderRadius: 3 }}>
              <CardContent>
                <Cancel sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {reservations.filter(r => r.status === 'cancelled').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annulées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Liste des réservations */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h5" fontWeight={700}>
                📋 Mes Réservations
              </Typography>
            </Box>
            
            {reservations.length === 0 ? (
              <Box textAlign="center" py={6}>
                <LocalActivity sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" mb={2}>
                  Aucune réservation trouvée
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{ borderRadius: 3 }}
                >
                  Faire une réservation
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell><strong>Service</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Personnes</strong></TableCell>
                      <TableCell><strong>Prix</strong></TableCell>
                      <TableCell><strong>Statut</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {reservation.service?.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {reservation.service?.agency?.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(reservation.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{reservation.number_of_people}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            {reservation.total_price}€
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(reservation.status)}
                            color={getStatusColor(reservation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => generatePDF(reservation)}
                              color="primary"
                              title="Télécharger PDF"
                            >
                              <Download />
                            </IconButton>
                            {canModifyOrCancel(reservation.reservation_date) && reservation.status !== 'cancelled' && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(reservation)}
                                  color="warning"
                                  title="Modifier"
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCancelRequest(reservation)}
                                  color="error"
                                  title="Annuler"
                                >
                                  <Cancel />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Dialog de modification */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Modifier la réservation</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={editData.reservation_date || ''}
                  onChange={(e) => setEditData({...editData, reservation_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Heure"
                  type="time"
                  value={editData.start_time || ''}
                  onChange={(e) => setEditData({...editData, start_time: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de personnes"
                  type="number"
                  value={editData.number_of_people || ''}
                  onChange={(e) => setEditData({...editData, number_of_people: parseInt(e.target.value)})}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={editData.guest_phone || ''}
                  onChange={(e) => setEditData({...editData, guest_phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Demandes spéciales"
                  multiline
                  rows={3}
                  value={editData.special_requests || ''}
                  onChange={(e) => setEditData({...editData, special_requests: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Annuler</Button>
            <Button onClick={handleConfirmEdit} variant="contained">Modifier</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmation d'annulation */}
        <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
          <DialogTitle>Confirmer l'annulation</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir annuler cette réservation ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialog(false)}>Non, garder</Button>
            <Button onClick={handleConfirmCancel} variant="contained" color="error">
              Oui, annuler
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ClientSpace;
