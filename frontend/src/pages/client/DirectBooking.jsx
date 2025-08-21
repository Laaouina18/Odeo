import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Event,
  Check,
  Download
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { createPublicReservation, getPublicReservation } from '../../api/publicReservations';
import { getServiceWithDates } from '../../api/services';

const DirectBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: 1,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');

  const steps = ['Informations', 'Confirmation', 'Facture PDF'];

  // Charger les données du service
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoadingService(true);
        const response = await getServiceWithDates(serviceId);
        setService(response);
      } catch (error) {
        setError('Erreur lors du chargement du service');
        console.error('Erreur service:', error);
      } finally {
        setLoadingService(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    return bookingData.name && 
           bookingData.email && 
           bookingData.date && 
           bookingData.time && 
           bookingData.people > 0;
  };

  const handleSubmitBooking = async () => {
    if (!validateForm()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Créer la réservation via l'API
      const response = await createPublicReservation({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        serviceId: parseInt(serviceId),
        date: bookingData.date,
        time: bookingData.time,
        people: bookingData.people,
        specialRequests: bookingData.specialRequests
      });
      
      if (response.reservation) {
        setReservation(response.reservation);
        setBookingConfirmed(true);
        setActiveStep(1);
        
        // Générer automatiquement le PDF après confirmation
        setTimeout(() => {
          generatePDF(response.reservation);
          setActiveStep(2);
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de la réservation');
      console.error('Erreur réservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = (reservation) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configuration de style
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let currentY = margin;
    
    // En-tête
    pdf.setFontSize(24);
    pdf.setTextColor(25, 118, 210); // Couleur primaire
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
    
    // Ligne de séparation
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
    
    // Informations client
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('INFORMATIONS CLIENT', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Nom: ${reservation.guest_name || reservation.name}`, margin, currentY);
    pdf.text(`Email: ${reservation.guest_email || reservation.email}`, margin, currentY + 7);
    if (reservation.guest_phone || reservation.phone) {
      pdf.text(`Téléphone: ${reservation.guest_phone || reservation.phone}`, margin, currentY + 14);
      currentY += 21;
    } else {
      currentY += 14;
    }
    
    currentY += 10;
    
    // Détails de la réservation
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('DÉTAILS DE LA RÉSERVATION', margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Service: ${reservation.service?.title || service?.title || 'Service'}`, margin, currentY);
    pdf.text(`Agence: ${reservation.service?.agency?.name || 'Agence'}`, margin, currentY + 7);
    pdf.text(`Date: ${new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}`, margin, currentY + 14);
    pdf.text(`Heure: ${reservation.start_time ? new Date(reservation.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : bookingData.time}`, margin, currentY + 21);
    pdf.text(`Nombre de personnes: ${reservation.number_of_people}`, margin, currentY + 28);
    
    if (reservation.special_requests) {
      pdf.text(`Demandes spéciales: ${reservation.special_requests}`, margin, currentY + 35);
      currentY += 42;
    } else {
      currentY += 35;
    }
    
    currentY += 15;
    
    // Récapitulatif financier
    pdf.setFontSize(14);
    pdf.setTextColor(25, 118, 210);
    pdf.text('RÉCAPITULATIF FINANCIER', margin, currentY);
    currentY += 15;
    
    // Cadre pour le total
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
    pdf.setTextColor(46, 125, 50); // Vert
    pdf.text('✓ RÉSERVATION CONFIRMÉE', margin, currentY);
    
    currentY += 20;
    
    // Conditions
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('CONDITIONS:', margin, currentY);
    pdf.text('• Annulation gratuite jusqu\'à 24h avant l\'activité', margin, currentY + 7);
    pdf.text('• Équipements et guide inclus', margin, currentY + 14);
    pdf.text('• Rendez-vous 15 minutes avant l\'heure prévue', margin, currentY + 21);
    pdf.text('• Contact agence: +212 XXX XXX XXX', margin, currentY + 28);
    
    currentY += 40;
    pdf.setTextColor(25, 118, 210);
    pdf.text('Merci de votre confiance ! Excellent séjour avec Odeo', margin, currentY);
    
    // Télécharger le PDF
    pdf.save(`facture-reservation-${reservation.id}.pdf`);
  };

  if (loadingService) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !service) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 'md', mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (bookingConfirmed && activeStep === 2) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
        <Box maxWidth="md" mx="auto" textAlign="center">
          <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={800} color="success.main" mb={2}>
            Réservation Confirmée !
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Votre facture PDF a été générée et téléchargée automatiquement.
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            📄 Facture PDF téléchargée : facture-reservation-{reservation?.id}.pdf
          </Alert>
          
          <Box sx={{ mb: 3 }}>
            <Chip label={`Réservation N° ${reservation?.id}`} color="primary" size="large" />
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Retour à l'accueil
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => generatePDF(reservation)}
            startIcon={<Download />}
          >
            Télécharger PDF à nouveau
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Box maxWidth="md" mx="auto">
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
                  🏜️ {service?.title || 'Réservation Service'}
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Nom complet *"
                      variant="outlined"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      variant="outlined"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      variant="outlined"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Nombre de personnes *"
                      type="number"
                      variant="outlined"
                      value={bookingData.people}
                      onChange={(e) => handleInputChange('people', parseInt(e.target.value) || 1)}
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Date disponible *</InputLabel>
                      <Select
                        value={bookingData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        label="Date disponible *"
                        startAdornment={<Event sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        {service?.availableDates?.map((date) => (
                          <MenuItem key={date} value={date}>
                            {new Date(date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Heure *"
                      type="time"
                      variant="outlined"
                      value={bookingData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Demandes spéciales"
                      multiline
                      rows={3}
                      variant="outlined"
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" mb={2}>💰 Récapitulatif</Typography>
                  <Typography variant="body1" mb={1}>
                    Prix: {service?.price || 120}€ × {bookingData.people} personne(s)
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    Total: {(service?.price || 120) * bookingData.people}€
                  </Typography>
                </Paper>
                
                <Box textAlign="center" mt={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitBooking}
                    disabled={!validateForm() || isSubmitting}
                    sx={{ px: 4, py: 2, borderRadius: 3, fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Confirmation en cours...' : 'Confirmer la réservation'}
                  </Button>
                </Box>
              </>
            )}
            
            {activeStep === 1 && bookingConfirmed && (
              <Box textAlign="center">
                <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} color="success.main" mb={2}>
                  Réservation confirmée !
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Génération de votre facture PDF en cours...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="spinner"></div>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default DirectBooking;
