import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createCategory, updateCategory, deleteCategory } from '../../features/admin/categoriesSlice';

const CategoryForm = ({ category, onClose }) => {
  const [form, setForm] = useState(category || { name: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      dispatch(updateCategory(form));
    } else {
      dispatch(createCategory(form));
    }
    if (onClose) onClose();
  };

  const handleDelete = () => {
    if (category) {
      dispatch(deleteCategory(category.id));
      if (onClose) onClose();
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" mb={2}>{category ? 'Modifier la catégorie' : 'Créer une catégorie'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nom" name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>{category ? 'Mettre à jour' : 'Créer'}</Button>
        {category && (
          <Button variant="outlined" color="error" fullWidth onClick={handleDelete}>Supprimer</Button>
        )}
      </form>
    </Paper>
  );
};

export default CategoryForm;
