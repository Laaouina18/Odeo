import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  Event,
  Person,
  Euro,
  CreditCard
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const steps = ['Détails', 'Confirmation', 'Facture'];

const QuickBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    people: 1,
    specialRequests: '',
    // Infos client
    name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { serviceId } = useParams();

  // Simulation des données de service
  const service = {
    id: serviceId,
    title: 'Excursion Quad Désert',
    description: 'Partez à l\'aventure en quad dans le désert',
    price: 120,
    agency: 'Agence Sahara',
    location: 'Merzouga, Maroc'
  };

  const totalPrice = service.price * formData.people;
  const commission = totalPrice * 0.1; // 10%
  const finalPrice = totalPrice;

  const handleNext = () => {
    if (activeStep === 0) {
      // Validation simple
      if (!formData.date || !formData.time || !formData.name || !formData.email) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleConfirmBooking = () => {
    // Simuler la création de réservation
    const reservationData = {
      ...formData,
      serviceId: service.id,
      totalPrice: finalPrice,
      status: 'confirmed',
      bookingId: Date.now(), // ID simple pour demo
    };
    
    // Sauvegarder dans localStorage pour la page de confirmation
    localStorage.setItem('lastBooking', JSON.stringify(reservationData));
    
    // Aller directement à la confirmation avec génération PDF
    navigate(`/confirmation/${reservationData.bookingId}`);
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Détails du service
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {service.description}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    <strong>Agence:</strong> {service.agency}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    <strong>Lieu:</strong> {service.location}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {service.price}€ / personne
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Informations de réservation
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date souhaitée"
                        type="date"
                        value={formData.date}
                        onChange={handleChange('date')}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Heure"
                        type="time"
                        value={formData.time}
                        onChange={handleChange('time')}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre de personnes"
                        type="number"
                        value={formData.people}
                        onChange={handleChange('people')}
                        inputProps={{ min: 1, max: 10 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Demandes spéciales (optionnel)"
                        multiline
                        rows={3}
                        value={formData.specialRequests}
                        onChange={handleChange('specialRequests')}
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Vos informations
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom complet"
                        value={formData.name}
                        onChange={handleChange('name')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
                    Confirmation de votre réservation
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Veuillez vérifier les détails de votre réservation avant de confirmer.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                          SERVICE
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {service.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.agency}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                          DATE & HEURE
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {new Date(formData.date).toLocaleDateString('fr-FR')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          à {formData.time}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                          CLIENT
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {formData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.email}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" mb={1}>
                          DÉTAILS
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {formData.people} personne(s)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.price}€ × {formData.people}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    {formData.specialRequests && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" mb={1}>
                            DEMANDES SPÉCIALES
                          </Typography>
                          <Typography variant="body2">
                            {formData.specialRequests}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight={800}>
                      Total: {finalPrice}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commission incluse
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Box maxWidth="lg" mx="auto">
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
          Réservation Express
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, justifyContent: 'center' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            sx={{ mr: 1 }}
          >
            Retour
          </Button>
          
          <Box sx={{ flex: '1 1 auto' }} />
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleConfirmBooking}
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              Confirmer et générer la facture
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
            >
              {activeStep === 0 ? 'Vérifier' : 'Confirmer'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuickBooking;
