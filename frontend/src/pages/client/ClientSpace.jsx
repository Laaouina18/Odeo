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
  IconButton,
  Pagination
} from '@mui/material';

// Professional Fresh Color Palette
const PRIMARY_COLOR = '#1e3c72';
const SECONDARY_COLOR = '#2a5298';
const VIOLET_BLUE = '#667eea';
const VIOLET_PURPLE = '#764ba2';
const ACCENT_RED = '#ff4d4f';
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 6;
  
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

  // Pagination functions
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);
  const startIndex = (currentPage - 1) * reservationsPerPage;
  const endIndex = startIndex + reservationsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
      setCurrentPage(1); // Reset pagination
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
      setCurrentPage(1); // Reset pagination
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
        {/* En-tête */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Person sx={{ fontSize: 50, color: 'white', mr: 3 }} />
              <Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    background: 'linear-gradient(45deg, white, rgba(255, 255, 255, 0.8))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  👤 Espace Client
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontWeight: 600 
                  }}
                >
                  Bienvenue {user?.name} ! ✨
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ 
                background: `linear-gradient(45deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                color: 'white',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                boxShadow: `0 8px 25px rgba(102, 126, 234, 0.4)`,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: `linear-gradient(45deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 35px rgba(102, 126, 234, 0.6)`
                }
              }}
            >
              🚀 Nouvelle réservation
            </Button>
          </Box>
        </Paper>

        {/* Messages */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              background: `${ACCENT_RED}10`,
              border: `2px solid ${ACCENT_RED}30`,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              '& .MuiAlert-icon': { color: ACCENT_RED },
              '& .MuiAlert-message': { color: ACCENT_RED, fontWeight: 600 }
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              background: 'rgba(76, 175, 80, 0.15)',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              '& .MuiAlert-icon': { color: 'success.main' },
              '& .MuiAlert-message': { color: 'success.main', fontWeight: 600 }
            }} 
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* Statistiques rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(30, 60, 114, 0.12)',
                transition: 'all 0.3s ease',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(30, 60, 114, 0.18)',
                  background: 'rgba(255, 255, 255, 0.98)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: `0 4px 16px ${PRIMARY_COLOR}40`
                  }}
                >
                  <LocalActivity sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    lineHeight: 1.2
                  }}
                >
                  {reservations.length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Réservations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
                transition: 'all 0.3s ease',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.18)',
                  background: 'rgba(255, 255, 255, 0.98)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: `0 4px 16px ${VIOLET_BLUE}40`
                  }}
                >
                  <CalendarToday sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    lineHeight: 1.2
                  }}
                >
                  {reservations.filter(r => r.status === 'confirmed').length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Confirmées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
                transition: 'all 0.3s ease',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.18)',
                  background: 'rgba(255, 255, 255, 0.98)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: `0 4px 16px ${VIOLET_BLUE}40`,
                    opacity: 0.8
                  }}
                >
                  <Event sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    lineHeight: 1.2,
                    opacity: 0.8
                  }}
                >
                  {reservations.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  En attente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `0 8px 32px ${ACCENT_RED}12`,
                transition: 'all 0.3s ease',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${ACCENT_RED}18`,
                  background: 'rgba(255, 255, 255, 0.98)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: ACCENT_RED,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: `0 4px 16px ${ACCENT_RED}40`
                  }}
                >
                  <Cancel sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: ACCENT_RED,
                    mb: 1,
                    lineHeight: 1.2
                  }}
                >
                  {reservations.filter(r => r.status === 'cancelled').length}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Annulées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Liste des réservations */}
        <Card 
          sx={{ 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(30, 60, 114, 0.08)'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 4, pb: 2 }}>
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
                📋 Mes Réservations
              </Typography>
            </Box>
            
            {reservations.length === 0 ? (
              <Box textAlign="center" py={8}>
                <LocalActivity sx={{ fontSize: 80, color: '#e2e8f0', mb: 3 }} />
                <Typography 
                  variant="h6" 
                  sx={{ color: '#64748b', mb: 2, fontWeight: 600 }}
                >
                  Aucune réservation trouvée
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{ 
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    boxShadow: `0 4px 16px ${VIOLET_BLUE}40`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${VIOLET_BLUE}50`
                    }
                  }}
                >
                  Faire une réservation
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow 
                      sx={{ 
                        background: '#f8fafc'
                      }}
                    >
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Service
                      </TableCell>
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Personnes
                      </TableCell>
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Prix
                      </TableCell>
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Statut
                      </TableCell>
                      <TableCell sx={{ color: '#374151', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentReservations.map((reservation) => (
                      <TableRow 
                        key={reservation.id} 
                        sx={{
                          '&:hover': { 
                            backgroundColor: '#f8fafc'
                          },
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        <TableCell sx={{ py: 3 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                              {reservation.service?.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              {reservation.service?.agency?.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Box>
                            <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 600, mb: 0.5 }}>
                              {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              {new Date(reservation.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Typography variant="body1" sx={{ color: '#1f2937', fontWeight: 600 }}>
                            {reservation.number_of_people}
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
                            {reservation.total_price}€
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Chip 
                            label={getStatusText(reservation.status)}
                            color={getStatusColor(reservation.status)}
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => generatePDF(reservation)}
                              sx={{
                                color: VIOLET_BLUE,
                                backgroundColor: `${VIOLET_BLUE}10`,
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: `${VIOLET_BLUE}20`,
                                  transform: 'scale(1.1)'
                                }
                              }}
                              title="Télécharger PDF"
                            >
                              <Download fontSize="small" />
                            </IconButton>
                            {canModifyOrCancel(reservation.reservation_date) && reservation.status !== 'cancelled' && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(reservation)}
                                  sx={{
                                    color: '#f59e0b',
                                    backgroundColor: '#fef3c7',
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: '#fde68a',
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                  title="Modifier"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCancelRequest(reservation)}
                                  sx={{
                                    color: ACCENT_RED,
                                    backgroundColor: `${ACCENT_RED}10`,
                                    borderRadius: 2,
                                    '&:hover': {
                                      backgroundColor: `${ACCENT_RED}20`,
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                  title="Annuler"
                                >
                                  <Cancel fontSize="small" />
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
            
            {/* Pagination */}
            {reservations.length > reservationsPerPage && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 3,
                  borderTop: '1px solid #e5e7eb'
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                        color: 'white',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`
                        }
                      },
                      '&:hover': {
                        backgroundColor: '#f3f4f6'
                      }
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 3, 
                    color: '#6b7280',
                    fontWeight: 500
                  }}
                >
                  {startIndex + 1}-{Math.min(endIndex, reservations.length)} sur {reservations.length} réservations
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Dialog de modification */}
        <Dialog 
          open={editDialog} 
          onClose={() => setEditDialog(false)} 
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
            Modifier la réservation
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={editData.reservation_date || ''}
                  onChange={(e) => setEditData({...editData, reservation_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Heure"
                  type="time"
                  value={editData.start_time || ''}
                  onChange={(e) => setEditData({...editData, start_time: e.target.value})}
                  InputLabelProps={{ shrink: true }}
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de personnes"
                  type="number"
                  value={editData.number_of_people || ''}
                  onChange={(e) => setEditData({...editData, number_of_people: parseInt(e.target.value)})}
                  inputProps={{ min: 1, max: 20 }}
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={editData.guest_phone || ''}
                  onChange={(e) => setEditData({...editData, guest_phone: e.target.value})}
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
                  label="Demandes spéciales"
                  multiline
                  rows={3}
                  value={editData.special_requests || ''}
                  onChange={(e) => setEditData({...editData, special_requests: e.target.value})}
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
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button 
              onClick={() => setEditDialog(false)}
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
              onClick={handleConfirmEdit} 
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
              Modifier
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmation d'annulation */}
        <Dialog 
          open={cancelDialog} 
          onClose={() => setCancelDialog(false)}
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
            Confirmer l'annulation
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography sx={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir annuler cette réservation ?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button 
              onClick={() => setCancelDialog(false)}
              sx={{ 
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f3f4f6' }
              }}
            >
              Non, garder
            </Button>
            <Button 
              onClick={handleConfirmCancel} 
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
              Oui, annuler
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ClientSpace;
