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
import { getUserFromStorage, isAuthenticated, getClientId } from '../../utils/storage';

const DirectBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
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

  // Palette de couleurs professionnelle
  const PRIMARY_COLOR = '#1e3c72';
  const SECONDARY_COLOR = '#2a5298';
  const VIOLET_BLUE = '#667eea';
  const VIOLET_PURPLE = '#764ba2';
  const ACCENT_RED = '#ff4d4f';

  const steps = ['Informations', 'Confirmation', 'Facture PDF'];

  // Récupérer l'utilisateur connecté et pré-remplir le formulaire
  useEffect(() => {
    const user = getUserFromStorage();
    if (user && isAuthenticated()) {
      setCurrentUser(user);
      setBookingData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, []);

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
      // Préparer les données de réservation
      const reservationData = {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        serviceId: parseInt(serviceId),
        date: bookingData.date,
        time: bookingData.time,
        people: bookingData.people,
        specialRequests: bookingData.specialRequests
      };

      // Ajouter l'ID utilisateur si connecté
      if (currentUser && isAuthenticated()) {
        reservationData.userId = currentUser.id;
      }

      // Créer la réservation via l'API
      const response = await createPublicReservation(reservationData);
      
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
      <Box sx={{ 
        bgcolor: 'transparent',
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(248, 250, 252, 0.95) 25%,
          rgba(241, 245, 249, 0.9) 50%,
          rgba(226, 232, 240, 0.95) 100%
        )`,
        backdropFilter: 'blur(20px)',
        minHeight: '100vh', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
          zIndex: -1,
        }
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(30px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `0 16px 48px ${PRIMARY_COLOR}15, 0 8px 24px rgba(0, 0, 0, 0.1)`
        }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: PRIMARY_COLOR,
              mb: 2
            }} 
          />
          <Typography variant="h6" sx={{ 
            color: PRIMARY_COLOR,
            fontWeight: 600 
          }}>
            Chargement du service...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !service) {
    return (
      <Box sx={{ 
        bgcolor: 'transparent',
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(248, 250, 252, 0.95) 25%,
          rgba(241, 245, 249, 0.9) 50%,
          rgba(226, 232, 240, 0.95) 100%
        )`,
        backdropFilter: 'blur(20px)',
        minHeight: '100vh', 
        p: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
          zIndex: -1,
        }
      }}>
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 'md', 
            mx: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${ACCENT_RED}30`,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${ACCENT_RED}20`
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (bookingConfirmed && activeStep === 2) {
    return (
      <Box sx={{ 
        bgcolor: 'transparent',
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(248, 250, 252, 0.95) 25%,
          rgba(241, 245, 249, 0.9) 50%,
          rgba(226, 232, 240, 0.95) 100%
        )`,
        backdropFilter: 'blur(20px)',
        minHeight: '100vh', 
        p: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
          zIndex: -1,
        }
      }}>
        <Box 
          maxWidth="md" 
          mx="auto" 
          textAlign="center"
          sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `0 16px 48px ${PRIMARY_COLOR}15, 0 8px 24px rgba(0, 0, 0, 0.1)`
          }}
        >
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, #4caf50, #66bb6a)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            animation: 'pulse 2s infinite'
          }}>
            <Check sx={{ fontSize: 60, color: 'white' }} />
          </Box>
          
          <Typography variant="h3" fontWeight={800} sx={{
            background: `linear-gradient(135deg, #4caf50, #66bb6a)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Réservation Confirmée !
          </Typography>
          
          <Typography variant="h6" color="text.secondary" mb={3} sx={{ fontWeight: 500 }}>
            Votre facture PDF a été générée et téléchargée automatiquement.
          </Typography>
          
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 3
            }}
          >
            📄 Facture PDF téléchargée : facture-reservation-{reservation?.id}.pdf
          </Alert>
          
          <Box sx={{ mb: 4 }}>
            <Chip 
              label={`Réservation N° ${reservation?.id}`} 
              sx={{
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                py: 3,
                px: 2,
                boxShadow: `0 4px 16px ${PRIMARY_COLOR}30`
              }}
              size="large" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 6px 20px ${PRIMARY_COLOR}30`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${PRIMARY_COLOR}40`,
                }
              }}
            >
              Retour à l'accueil
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => generatePDF(reservation)}
              startIcon={<Download />}
              sx={{
                borderColor: VIOLET_BLUE,
                color: VIOLET_BLUE,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: VIOLET_PURPLE,
                  background: `${VIOLET_BLUE}10`,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Télécharger PDF à nouveau
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: 'transparent',
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.95) 25%,
        rgba(241, 245, 249, 0.9) 50%,
        rgba(226, 232, 240, 0.95) 100%
      )`,
      backdropFilter: 'blur(20px)',
      minHeight: '100vh', 
      p: 3,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
        zIndex: -1,
      }
    }}>
      <Box maxWidth="md" mx="auto">
        {/* Stepper */}
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            p: 3,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `0 8px 32px ${PRIMARY_COLOR}10`,
            '& .MuiStepLabel-root .Mui-completed': {
              color: PRIMARY_COLOR,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: VIOLET_BLUE,
            },
            '& .MuiStepConnector-alternativeLabel': {
              top: 10,
              left: 'calc(-50% + 16px)',
              right: 'calc(50% + 16px)',
            },
            '& .MuiStepConnector-alternativeLabel.Mui-active .MuiStepConnector-line': {
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
            },
            '& .MuiStepConnector-alternativeLabel.Mui-completed .MuiStepConnector-line': {
              background: PRIMARY_COLOR,
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  color: 'text.primary'
                }
              }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ 
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `0 16px 48px ${PRIMARY_COLOR}15, 0 8px 24px rgba(0, 0, 0, 0.1)`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE}, ${ACCENT_RED})`,
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            {activeStep === 0 && (
              <>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" fontWeight={700} sx={{
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}>
                    🏜️ {service?.title || 'Réservation Service'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Remplissez vos informations pour confirmer votre réservation
                  </Typography>
                </Box>
                
                {currentUser && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mb: 3,
                      background: `${PRIMARY_COLOR}08`,
                      border: `1px solid ${PRIMARY_COLOR}20`,
                      borderRadius: 3,
                      '& .MuiAlert-icon': {
                        color: PRIMARY_COLOR
                      }
                    }}
                  >
                    ✅ Vous êtes connecté en tant que <strong>{currentUser.name}</strong>. Vos informations seront liées à votre compte.
                  </Alert>
                )}
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      background: `${ACCENT_RED}08`,
                      border: `1px solid ${ACCENT_RED}20`,
                      borderRadius: 3,
                      '& .MuiAlert-icon': {
                        color: ACCENT_RED
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                {!currentUser && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mb: 3,
                      background: 'rgba(255, 152, 0, 0.08)',
                      border: '1px solid rgba(255, 152, 0, 0.2)',
                      borderRadius: 3
                    }}
                  >
                    💡 Vous pouvez réserver sans compte, mais si vous souhaitez suivre vos réservations, 
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/login')}
                      sx={{ 
                        ml: 1, 
                        textTransform: 'none', 
                        fontWeight: 600,
                        color: PRIMARY_COLOR,
                        '&:hover': {
                          background: `${PRIMARY_COLOR}10`
                        }
                      }}
                    >
                      connectez-vous ici
                    </Button>
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
                        startAdornment: <Person sx={{ mr: 1, color: PRIMARY_COLOR }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: PRIMARY_COLOR,
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: PRIMARY_COLOR,
                          fontWeight: 600
                        }
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: PRIMARY_COLOR,
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: PRIMARY_COLOR,
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      variant="outlined"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: VIOLET_BLUE,
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: VIOLET_BLUE,
                          fontWeight: 600
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: VIOLET_BLUE,
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: VIOLET_BLUE,
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{
                        '&.Mui-focused': {
                          color: VIOLET_PURPLE,
                          fontWeight: 600
                        }
                      }}>Date disponible *</InputLabel>
                      <Select
                        value={bookingData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        label="Date disponible *"
                        startAdornment={<Event sx={{ mr: 1, color: VIOLET_PURPLE }} />}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: VIOLET_PURPLE,
                            borderWidth: 2
                          }
                        }}
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
                      InputLabelProps={{ 
                        shrink: true,
                        sx: {
                          '&.Mui-focused': {
                            color: VIOLET_PURPLE,
                            fontWeight: 600
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: VIOLET_PURPLE,
                            borderWidth: 2
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: SECONDARY_COLOR,
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: SECONDARY_COLOR,
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ 
                  my: 4,
                  '&::before, &::after': {
                    borderColor: `${PRIMARY_COLOR}20`,
                  }
                }} />
                
                <Paper sx={{ 
                  p: 4,
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05)`,
                  border: `2px solid ${PRIMARY_COLOR}20`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                      mr: 2
                    }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: PRIMARY_COLOR
                    }}>
                      💰 Récapitulatif de la réservation
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      Prix unitaire:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: PRIMARY_COLOR }}>
                      {service?.price || 120}€
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      Nombre de personnes:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: VIOLET_BLUE }}>
                      {bookingData.people} personne(s)
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: `${PRIMARY_COLOR}30` }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}15, ${VIOLET_BLUE}10)`,
                    borderRadius: 2,
                    border: `1px solid ${PRIMARY_COLOR}30`
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: PRIMARY_COLOR }}>
                      Total:
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 800,
                      color: PRIMARY_COLOR,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      {(service?.price || 120) * bookingData.people}€
                    </Typography>
                  </Box>
                </Paper>
                
                <Box textAlign="center" mt={4}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitBooking}
                    disabled={!validateForm() || isSubmitting}
                    sx={{ 
                      px: 6, 
                      py: 2, 
                      borderRadius: 3, 
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                      boxShadow: `0 8px 24px ${PRIMARY_COLOR}30`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${PRIMARY_COLOR}40`,
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)'
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Confirmation en cours...
                      </>
                    ) : (
                      'Confirmer la réservation'
                    )}
                  </Button>
                </Box>
              </>
            )}
            
            {activeStep === 1 && bookingConfirmed && (
              <Box textAlign="center">
                <Box sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, #4caf50, #66bb6a)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  <Check sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                
                <Typography variant="h5" fontWeight={700} sx={{
                  background: `linear-gradient(135deg, #4caf50, #66bb6a)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}>
                  Réservation confirmée !
                </Typography>
                
                <Typography variant="body1" color="text.secondary" mb={3} sx={{ fontWeight: 500 }}>
                  Génération de votre facture PDF en cours...
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <CircularProgress 
                    size={40}
                    sx={{ color: PRIMARY_COLOR }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Préparation du document...
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <style jsx>{`
        @keyframes pulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(76, 175, 80, 0.5);
          }
          100% { 
            transform: scale(1);
            box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </Box>
  );
};

export default DirectBooking;
