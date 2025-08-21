import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Paper,
  Alert,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Print,
  Email,
  Event,
  Person,
  LocationOn
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ConfirmationPage = () => {
  const [booking, setBooking] = useState(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  useEffect(() => {
    // Récupérer les données de réservation depuis localStorage
    const bookingData = localStorage.getItem('lastBooking');
    if (bookingData) {
      const parsedBooking = JSON.parse(bookingData);
      setBooking(parsedBooking);
      
      // Générer automatiquement le PDF après un court délai
      setTimeout(() => {
        generatePDF(true); // true = téléchargement automatique
      }, 2000);
    } else {
      // Rediriger si pas de données
      navigate('/services');
    }
  }, [bookingId, navigate]);

  const generatePDF = async (autoDownload = false) => {
    if (!booking || !invoiceRef.current) return;

    try {
      // Options pour html2canvas
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Ajouter des pages si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Sauvegarder le PDF
      const fileName = `facture-${booking.bookingId}.pdf`;
      
      if (autoDownload) {
        pdf.save(fileName);
        setPdfGenerated(true);
      } else {
        pdf.save(fileName);
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  if (!booking) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      <Box maxWidth="lg" mx="auto">
        {/* Message de confirmation */}
        <Box textAlign="center" mb={4}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={800} color="success.main" mb={2}>
            Réservation confirmée !
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Merci pour votre réservation. Votre facture a été générée automatiquement.
          </Typography>
          {pdfGenerated && (
            <Alert severity="success" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              📄 Votre facture PDF a été téléchargée automatiquement !
            </Alert>
          )}
        </Box>

        {/* Actions rapides */}
        <Box textAlign="center" mb={4}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => generatePDF()}
            sx={{ mr: 2, mb: 2 }}
          >
            Télécharger PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ mr: 2, mb: 2 }}
          >
            Imprimer
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/client/reservations')}
            sx={{ mb: 2 }}
          >
            Mes réservations
          </Button>
        </Box>

        {/* Facture pour PDF */}
        <Card 
          ref={invoiceRef} 
          sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            backgroundColor: '#ffffff',
            border: '2px solid #e0e0e0'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* En-tête de facture */}
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h3" fontWeight={800} color="primary.main">
                    ODEO
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Plateforme de réservation d'activités
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5" fontWeight={700}>
                    FACTURE
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    N° {booking.bookingId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date().toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Box>

            {/* Informations client et service */}
            <Grid container spacing={4} mb={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
                    👤 INFORMATIONS CLIENT
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.email}
                  </Typography>
                  {booking.phone && (
                    <Typography variant="body2" color="text.secondary">
                      {booking.phone}
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
                    🏢 INFORMATIONS AGENCE
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Agence Sahara
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spécialiste des activités désert
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Merzouga, Maroc
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Détails de la réservation */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#f0f7ff', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={3} color="primary.main">
                📋 DÉTAILS DE LA RÉSERVATION
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Event sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date et heure
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nombre de personnes
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {booking.people} personne(s)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    🏜️ Excursion Quad Désert
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Partez à l'aventure en quad dans le désert avec guide et équipements fournis
                  </Typography>
                  {booking.specialRequests && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        Demandes spéciales:
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {booking.specialRequests}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Récapitulatif financier */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '2px solid', borderColor: 'primary.main' }}>
              <Typography variant="h6" fontWeight={700} mb={3} color="primary.main">
                💰 RÉCAPITULATIF FINANCIER
              </Typography>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">
                    Service (120€ × {booking.people} personnes)
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.totalPrice}€
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Commission plateforme (incluse)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Incluse
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight={800}>
                    TOTAL À PAYER
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {booking.totalPrice}€
                  </Typography>
                </Box>
              </Box>
              <Box textAlign="center" mt={2}>
                <Chip 
                  label="✅ PAYÉ" 
                  color="success" 
                  sx={{ fontWeight: 700, fontSize: '1rem', py: 2, px: 3 }}
                />
              </Box>
            </Paper>

            {/* Conditions */}
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                📝 CONDITIONS ET INFORMATIONS
              </Typography>
              <Typography variant="body2" mb={1}>
                • Annulation gratuite jusqu'à 24h avant l'activité
              </Typography>
              <Typography variant="body2" mb={1}>
                • Equipements et guide inclus
              </Typography>
              <Typography variant="body2" mb={1}>
                • Rendez-vous 15 minutes avant l'heure prévue
              </Typography>
              <Typography variant="body2" mb={1}>
                • Contact agence: +212 XXX XXX XXX
              </Typography>
              <Typography variant="body2" mb={2}>
                • Service client Odeo: contact@odeo.com
              </Typography>
              <Box textAlign="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Merci de votre confiance ! Excellent séjour avec Odeo 🌟
                </Typography>
              </Box>
            </Paper>
          </CardContent>
        </Card>

        {/* Actions en bas */}
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 2, borderRadius: 3, fontWeight: 700 }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmationPage;
