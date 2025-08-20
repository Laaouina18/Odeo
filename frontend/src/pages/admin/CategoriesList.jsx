import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Button } from '@mui/material';
import CategoryForm from './CategoryForm';

const CategoriesList = () => {
  const categories = useSelector((state) => state.categories.items);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>Catégories</Typography>
      <Button variant="contained" color="primary" onClick={() => { setEditingCategory(null); setShowForm(true); }} sx={{ mb: 2 }}>Ajouter une catégorie</Button>
      {showForm && (
        <CategoryForm category={editingCategory} onClose={() => setShowForm(false)} />
      )}
      {categories.map((category) => (
        <Paper key={category.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{category.name}</Typography>
          <Button variant="outlined" color="primary" onClick={() => { setEditingCategory(category); setShowForm(true); }} sx={{ mt: 1 }}>Modifier</Button>
        </Paper>
      ))}
    </Box>
  );
};

export default CategoriesList;
