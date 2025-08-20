import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Button } from '@mui/material';
import ServiceForm from './ServiceForm';

const ServicesList = () => {
  const services = useSelector((state) => state.services.items);
  const [editingService, setEditingService] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>Mes Services</Typography>
      <Button variant="contained" color="primary" onClick={() => { setEditingService(null); setShowForm(true); }} sx={{ mb: 2 }}>Ajouter un service</Button>
      {showForm && (
        <ServiceForm service={editingService} onClose={() => setShowForm(false)} />
      )}
      {services.map((service) => (
        <Paper key={service.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{service.name}</Typography>
          <Typography>{service.description}</Typography>
          <Typography>Prix: {service.price} €</Typography>
          <Button variant="outlined" color="primary" onClick={() => { setEditingService(service); setShowForm(true); }} sx={{ mt: 1 }}>Modifier</Button>
        </Paper>
      ))}
    </Box>
  );
};

export default ServicesList;
