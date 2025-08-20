import React, { useEffect, useState } from 'react';
import { fetchServices, createService, updateService, deleteService } from '../../api/services';
import { Box, Typography, Button, TextField, Paper, Stack } from '@mui/material';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '', location: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetchServices();
      setServices(res.data || res);
    } catch {
      setError('Erreur chargement services');
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

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createService(form);
      setForm({ title: '', description: '', price: '', category_id: '', location: '' });
      loadServices();
    } catch {
      setError('Erreur création service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setForm({ ...service });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateService(editId, form);
      setEditId(null);
      setForm({ title: '', description: '', price: '', category_id: '', location: '' });
      loadServices();
    } catch {
      setError('Erreur modification service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteService(id);
      loadServices();
    } catch {
      setError('Erreur suppression service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Liste des services</Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack spacing={2}>
          <TextField label="Titre" name="title" value={form.title} onChange={handleChange} />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
          <TextField label="Prix" name="price" value={form.price} onChange={handleChange} />
          <TextField label="Catégorie" name="category_id" value={form.category_id} onChange={handleChange} />
          <TextField label="Localisation" name="location" value={form.location} onChange={handleChange} />
          {editId ? (
            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={loading}>Modifier</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleCreate} disabled={loading}>Ajouter</Button>
          )}
        </Stack>
      </Paper>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Stack spacing={2}>
        {services && services.length > 0 ? services.map(service => (
          <Paper key={service.id} sx={{ p: 2 }}>
            <Typography variant="h6">{service.title}</Typography>
            <Typography>{service.description}</Typography>
            <Typography>Prix : {service.price}</Typography>
            <Typography>Catégorie : {service.category_id}</Typography>
            <Typography>Localisation : {service.location}</Typography>
            <Button variant="outlined" color="primary" onClick={() => handleEdit(service)} sx={{ mr: 2 }}>Modifier</Button>
            <Button variant="outlined" color="error" onClick={() => handleDelete(service.id)}>Supprimer</Button>
          </Paper>
        )) : <Typography>Aucun service trouvé.</Typography>}
      </Stack>
    </Box>
  );
};

export default ServiceList;
