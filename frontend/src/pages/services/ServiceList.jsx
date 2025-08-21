import React, { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '../../api/services';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Stack, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const categoriesList = [
  { id: 1, name: 'Voyage' },
  { id: 2, name: 'Quad' },
  { id: 3, name: 'Excursions' },
  { id: 4, name: 'Tourisme' },
  { id: 5, name: 'Autres' }
];

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    category_id: '', 
    location: '',
    status: 'inactive'
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, service: null });
  const [showForm, setShowForm] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      // Récupérer l'agency_id depuis localStorage
      const agency_id = localStorage.getItem('agency_id');
      const params = agency_id ? { agency_id } : {};
      
      const res = await getServices(params);
      setServices(res.data || res);
    } catch (err) {
      console.error('Erreur chargement services:', err);
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ 
      title: '', 
      description: '', 
      price: '', 
      category_id: '', 
      location: '',
      status: 'inactive'
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validation basique
      if (!form.title || !form.description || !form.price || !form.category_id) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Récupérer agency_id
      const agency_id = localStorage.getItem('agency_id');
      if (!agency_id) {
        throw new Error('Agency ID non trouvé');
      }

      const serviceData = {
        ...form,
        agency_id: parseInt(agency_id),
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id)
      };

      await createService(serviceData);
      setSuccess('Service créé avec succès !');
      resetForm();
      loadServices();
    } catch (err) {
      console.error('Erreur création service:', err);
      setError(err.message || 'Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setForm({ 
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      category_id: service.category_id || '',
      location: service.location || '',
      status: service.status || 'inactive'
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validation basique
      if (!form.title || !form.description || !form.price || !form.category_id) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const serviceData = {
        ...form,
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id)
      };

      await updateService(editId, serviceData);
      setSuccess('Service modifié avec succès !');
      resetForm();
      loadServices();
    } catch (err) {
      console.error('Erreur modification service:', err);
      setError(err.message || 'Erreur lors de la modification du service');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteDialog({ open: true, service });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.service) return;
    
    setLoading(true);
    setError('');
    
    try {
      await deleteService(deleteDialog.service.id);
      setSuccess('Service supprimé avec succès !');
      setDeleteDialog({ open: false, service: null });
      loadServices();
    } catch (err) {
      console.error('Erreur suppression service:', err);
      setError(err.message || 'Erreur lors de la suppression du service');
      setDeleteDialog({ open: false, service: null });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categoriesList.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Non définie';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'warning';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };

  // Messages d'alerte
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Box sx={{ p: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestion des Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(!showForm)}
          size="large"
        >
          {showForm ? 'Masquer le formulaire' : 'Ajouter un service'}
        </Button>
      </Box>

      {/* Messages d'alerte */}
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

      {/* Formulaire */}
      {showForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {editId ? 'Modifier le service' : 'Créer un nouveau service'}
          </Typography>
          
          <form onSubmit={editId ? handleUpdate : handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Titre"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prix (€)"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Catégorie"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  required
                  margin="normal"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categoriesList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Localisation"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Statut"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  margin="normal"
                >
                  <option value="inactive">Inactif</option>
                  <option value="active">Actif</option>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={editId ? <EditIcon /> : <AddIcon />}
              >
                {loading ? 'Traitement...' : (editId ? 'Modifier' : 'Créer')}
              </Button>
              <Button
                variant="outlined"
                onClick={resetForm}
                startIcon={<CancelIcon />}
              >
                Annuler
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      {/* Liste des services */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Services ({services.length})
      </Typography>
      
      <Divider sx={{ mb: 3 }} />

      {loading && services.length === 0 ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : services && services.length > 0 ? (
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {service.title}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(service.status)} 
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {service.description}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {service.price} €
                    </Typography>
                  </Box>

                  <Chip 
                    label={getCategoryName(service.category_id)} 
                    variant="outlined" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />

                  {service.location && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {service.location}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(service)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(service)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
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
            {showForm ? 'Remplissez le formulaire ci-dessus pour créer votre premier service' : 'Commencez par créer votre premier service'}
          </Typography>
          {!showForm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              Créer mon premier service
            </Button>
          )}
        </Paper>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, service: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le service <strong>"{deleteDialog.service?.title}"</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, service: null })}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceList;