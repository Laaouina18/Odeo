import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/authSlice';


const Register = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirige vers le dashboard selon le rôle
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'agency') navigate('/agency/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agency_name: '',
    agency_email: '',
    agency_phone: '',
    agency_description: '',
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const payload = role === 'client'
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'client',
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'agency',
            agency_name: form.agency_name,
            agency_email: form.agency_email,
            agency_phone: form.agency_phone,
            agency_description: form.agency_description,
          };
      await dispatch(register(payload));
      setSuccess('Inscription réussie !');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Inscription</Typography>
        <form onSubmit={handleSubmit}>
          <FormLabel>Je suis :</FormLabel>
          <RadioGroup row value={role} onChange={handleRoleChange} sx={{ mb: 2 }}>
            <FormControlLabel value="client" control={<Radio />} label="Client" />
            <FormControlLabel value="agency" control={<Radio />} label="Agence" />
          </RadioGroup>
          <TextField label="Nom" name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
          {role === 'agency' && (
            <>
              <TextField label="Nom de l'agence" name="agency_name" value={form.agency_name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
              <TextField label="Email de l'agence" name="agency_email" value={form.agency_email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
              <TextField label="Téléphone de l'agence" name="agency_phone" value={form.agency_phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
              <TextField label="Description de l'agence" name="agency_description" value={form.agency_description} onChange={handleChange} fullWidth multiline rows={2} sx={{ mb: 2 }} />
            </>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Inscription...' : 'Inscription'}
          </Button>
        </form>
        {success && <Typography color="success.main" mt={2}>{success}</Typography>}
        {error && <Typography color="error.main" mt={2}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default Register;
