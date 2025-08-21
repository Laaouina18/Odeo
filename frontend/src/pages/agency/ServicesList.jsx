import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Chip, 
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  CardMedia
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import ServiceForm from './ServiceForm';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchServices, 
  deleteServiceAction 
} from '../../store/slices/servicesSlice';

const ServicesList = () => {
  const dispatch = useDispatch();
  const { items: services, loading, error, pagination } = useSelector((state) => state.services);
  
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, service: null });

  // Charger les services au montage du composant
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const agency_id = localStorage.getItem('agency_id');
    if (agency_id) {
      dispatch(fetchServices({ agency_id }));
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
    // Recharger les services après ajout/modification
    loadServices();
  };

  const handleDeleteClick = (service) => {
    setDeleteDialog({ open: true, service });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.service) return;
    
    try {
      await dispatch(deleteServiceAction(deleteDialog.service.id)).unwrap();
      setDeleteDialog({ open: false, service: null });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'warning';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };

  if (showForm) {
    return (
      <ServiceForm 
        service={editingService} 
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mes Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
        >
          Ajouter un service
        </Button>
      </Box>

      {/* Messages d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : services.length === 0 ? (
        /* État vide */
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            bgcolor: 'grey.50',
            border: '2px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun service trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Commencez par créer votre premier service
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Créer mon premier service
          </Button>
        </Paper>
      ) : (
        /* Liste des services */
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                {/* Image du service */}
                {service.images && service.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${service.images[0]}`}
                    alt={service.title}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Aucune image
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Titre et statut */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {service.title}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(service.status)} 
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Catégorie */}
                  {service.category && (
                    <Chip 
                      label={service.category.name || service.category} 
                      variant="outlined" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                  )}

                  {/* Prix */}
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {service.price} €
                  </Typography>

                  {/* Localisation */}
                  {service.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {service.location}
                      </Typography>
                    </Box>
                  )}

                  {/* Dates disponibles */}
                  {service.dates && service.dates.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {service.dates.length} date(s) disponible(s)
                    </Typography>
                  )}
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    startIcon={<ViewIcon />}
                    onClick={() => {/* Implémenter la vue détail */}}
                  >
                    Voir
                  </Button>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, service: null })}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le service "{deleteDialog.service?.title}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, service: null })}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesList;