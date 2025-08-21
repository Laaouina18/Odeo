import React, { useState, useEffect } from 'react';
import { createService, updateService } from '../../api/services';
import { getCategories } from '../../api/categories';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  Chip, 
  OutlinedInput, 
  InputLabel,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';

const ServiceForm = ({ service = null, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    location: '',
    images: [],
    dates: [],
    status: 'inactive'
  });

  // State pour les catégories
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');

  // Charger les catégories au montage
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategoriesList(res.categories || []);
        setCategoriesError('');
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setCategoriesList([]);
        setCategoriesError('Erreur lors du chargement des catégories.');
      }
    }
    fetchCategories();
  }, []);

  // Initialiser le formulaire avec les données du service en mode édition
  useEffect(() => {
    if (service) {
      setForm({
        title: service.title || '',
        description: service.description || '',
        category_id: service.category_id || service.category?.id || '',
        price: service.price ? service.price.toString() : '',
        location: service.location || '',
                // images: [], // supprimé
        dates: service.dates || [],
        status: service.status || 'inactive'
      });
    }
  }, [service]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImagesChange = (e) => {
  setForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleDatesChange = (e) => {
    // Permet la saisie directe d'un array JSON ou d'une liste séparée par des virgules
    let value = e.target.value;
    let datesArray = [];
    try {
      // Si l'utilisateur colle un array JSON
      datesArray = JSON.parse(value);
      if (!Array.isArray(datesArray)) throw new Error();
    } catch {
      // Sinon, split par virgule
      datesArray = value
        .split(',')
        .map(date => date.trim())
        .filter(date => date && isValidDate(date));
    }
    setForm(prev => ({ ...prev, dates: datesArray }));
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  const handleCategorySelect = (categoryId) => {
    setForm(prev => ({ ...prev, category_id: categoryId }));
    
    // Clear validation error for category
    if (validationErrors.category_id) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category_id;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.title.trim()) errors.title = 'Le titre est requis';
    if (!form.description.trim()) errors.description = 'La description est requise';
    if (!form.category_id) errors.category_id = 'La catégorie est requise';
    if (!form.price || parseFloat(form.price) < 0) errors.price = 'Le prix doit être supérieur ou égal à 0';
    
    // Validation des dates
    if (form.dates.some(date => !isValidDate(date))) {
      errors.dates = 'Format de date invalide (utilisez YYYY-MM-DD)';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationErrors({});

    try {
      // Validation côté client
      const clientErrors = validateForm();
      if (Object.keys(clientErrors).length > 0) {
        setValidationErrors(clientErrors);
        setError('Veuillez corriger les erreurs dans le formulaire');
        setAlertOpen(true);
        return;
      }

      // Vérifier que agency_id existe
      const agency_id = localStorage.getItem('agency_id');
      if (!agency_id) {
        throw new Error('Agency ID non trouvé. Veuillez vous reconnecter.');
      }

      // Préparer les données selon si il y a des images ou non
      let dataToSend;
      let hasImages = form.images && form.images.length > 0;
      
      if (hasImages) {
        // Avec images : utiliser FormData
        const formData = new FormData();
        formData.append('agency_id', agency_id);
        formData.append('title', form.title.trim());
        formData.append('description', form.description.trim());
        formData.append('category_id', form.category_id);
        formData.append('price', parseFloat(form.price));
        formData.append('location', form.location.trim());
        formData.append('status', form.status);
        // Envoyer chaque date individuellement pour FormData
        form.dates.forEach(date => formData.append('dates[]', date));
        for (let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
        }
        dataToSend = formData;
      } else {
        // Sans images : utiliser JSON
        dataToSend = {
          agency_id: parseInt(agency_id),
          title: form.title.trim(),
          description: form.description.trim(),
          category_id: parseInt(form.category_id),
          price: parseFloat(form.price),
          location: form.location.trim(),
          status: form.status,
          dates: form.dates
        };
      }

      // Console log du contenu des données
      if (hasImages) {
        console.log('Envoi FormData:');
        for (let pair of dataToSend.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log('Envoi JSON:', dataToSend);
      }
      let response;
      if (service) {
        // Mode édition
        response = await updateService(service.id, dataToSend);
        setSuccess('Service modifié avec succès !');
      } else {
        // Mode création
        response = await createService(dataToSend);
        setSuccess('Service créé avec succès !');
      }
      
      setAlertOpen(true);
      
      // Reset du formulaire en mode création uniquement
      if (!service) {
        setForm({
          title: '',
          description: '',
          category_id: '',
          price: '',
          location: '',
          dates: [],
          status: 'inactive'
        });
      }

      // Appeler les callbacks
      if (onSuccess) onSuccess(response);
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      }

    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Réponse du serveur:', err.response?.data);
      
      // Gérer les erreurs de validation du serveur
        if (err.response?.data?.errors) {
          console.log('Validation errors:', err.response.data.errors);
          setValidationErrors(err.response.data.errors);
          setError('Erreurs de validation détectées: ' + JSON.stringify(err.response.data.errors));
        } else {
          setError(err.response?.data?.message || err.message || 'Erreur lors de la création du service');
        }
      
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categoriesList.find(cat => cat.id === parseInt(form.category_id));

  return (
    
       
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 400, maxWidth: 600, position: 'relative' }}>
        {/* Bouton fermer si mode modal */}
        {onClose && (
          <Button
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'auto', p: 1 }}
          >
            ✕
          </Button>
        )}
        
        <Typography variant="h5" mb={2} fontWeight={700}>
          {service ? 'Modifier le service' : 'Créer un nouveau service'}
        </Typography>

      
        <form onSubmit={handleSubmit}>
          <TextField
            label="Titre"
            name="title"
            fullWidth
            margin="normal"
            required
            value={form.title}
            onChange={handleChange}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            error={!!validationErrors.description}
            helperText={validationErrors.description}
          />

          {/* Input images multiples */}
          <InputLabel sx={{ mt: 2, mb: 1 }}>Images</InputLabel>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            style={{ marginBottom: '16px' }}
          />
   {/* Aperçu des images sélectionnées */}
          {form.images && form.images.length > 0 && (
            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {form.images.map((file, idx) => (
                <Box key={idx} sx={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                  />
                  <Button
                    size="small"
                    color="error"
                    sx={{ position: 'absolute', top: 2, right: 2, minWidth: 0, p: 0, fontSize: 12 }}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx)
                      }));
                    }}
                  >✕</Button>
                </Box>
              ))}
            </Stack>
          )}
          <InputLabel sx={{ mt: 2, mb: 1, color: validationErrors.category_id ? 'error.main' : 'inherit' }}>
            Catégorie *
          </InputLabel>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {categoriesError ? (
              <Chip label={categoriesError} color="error" disabled />
            ) : categoriesList.length === 0 ? (
              <Chip label="Chargement..." disabled />
            ) : (
              categoriesList.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  color={form.category_id === cat.id ? 'primary' : 'default'}
                  onClick={() => handleCategorySelect(cat.id)}
                  variant={form.category_id === cat.id ? 'filled' : 'outlined'}
                />
              ))
            )}
          </Stack>
          {validationErrors.category_id && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
              {validationErrors.category_id}
            </Typography>
          )}

          <TextField
            label="Prix (€)"
            name="price"
            type="number"
            fullWidth
            margin="normal"
            required
            value={form.price}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            error={!!validationErrors.price}
            helperText={validationErrors.price}
          />

          <TextField
            label="Localisation"
            name="location"
            fullWidth
            margin="normal"
            value={form.location}
            onChange={handleChange}
          />

         
       
          <TextField
            label="Dates disponibles (array ou séparées par des virgules)"
            name="dates"
            fullWidth
            margin="normal"
            value={Array.isArray(form.dates) ? form.dates.join(', ') : ''}
            onChange={handleDatesChange}
            placeholder='Ex: ["2024-09-01", "2024-09-15", "2024-10-01"] ou 2024-09-01, 2024-09-15'
            helperText="Format: YYYY-MM-DD ou coller un array JSON"
            error={!!validationErrors.dates}
          />
          {validationErrors.dates && (
            <Typography variant="caption" color="error">
              {validationErrors.dates}
            </Typography>
          )}

          <InputLabel sx={{ mt: 2, mb: 1 }}>Statut</InputLabel>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant={form.status === 'active' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => setForm(prev => ({ ...prev, status: 'active' }))}
            >
              Actif
            </Button>
            <Button
              variant={form.status === 'inactive' ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => setForm(prev => ({ ...prev, status: 'inactive' }))}
            >
              Inactif
            </Button>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading || categoriesList.length === 0}
          >
            {loading 
              ? (service ? 'Modification en cours...' : 'Création en cours...') 
              : (service ? 'Modifier le service' : 'Créer le service')
            }
          </Button>
        </form>

        {/* Aperçu */}
        <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>Aperçu</Typography>
          <Typography variant="body2">
            <strong>Titre:</strong> {form.title || 'Non défini'}
          </Typography>
          <Typography variant="body2">
            <strong>Catégorie:</strong> {selectedCategory?.name || 'Non définie'}
          </Typography>
          <Typography variant="body2">
            <strong>Prix:</strong> {form.price ? `${parseFloat(form.price).toFixed(2)} €` : 'Non défini'}
          </Typography>
          <Typography variant="body2">
            <strong>Statut:</strong> {form.status === 'active' ? 'Actif' : 'Inactif'}
          </Typography>
          {form.dates.length > 0 && (
            <Typography variant="body2">
              <strong>Dates:</strong> {form.dates.join(', ')}
            </Typography>
          )}
        </Paper>
      </Paper>

      <AlertSnackbar
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={error ? 'error' : 'success'}
        message={error || success}
      />
    </Box>
  );
};

export default ServiceForm;