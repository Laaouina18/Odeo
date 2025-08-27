import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Chip, Stack, InputLabel, OutlinedInput } from '@mui/material';
import AlertSnackbar from '../../components/AlertSnackbar';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

// Professional Fresh Color Pa          <Button 
            type="submit" 
            vari          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.8,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: `0 8px 25px rgba(102, 126, 234, 0.4)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(45deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 35px rgba(102, 126, 234, 0.6)`
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {loading ? '⏳ Inscription en cours...' : '🚀 S\'inscrire comme Agence'}
          </Button>
        </form>
        
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500
          }}
        >
          Déjà un compte ? {' '}
          <Box 
            component="a" 
            href="/login" 
            sx={{ 
              color: VIOLET_BLUE, 
              textDecoration: 'none', 
              fontWeight: 700,
              '&:hover': { 
                color: VIOLET_PURPLE,
                textDecoration: 'underline'
              } 
            }}
          >
            Connectez-vous ici
          </Box>
        </Typography>ntained" 
            fullWidth 
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.8,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: `0 8px 25px rgba(102, 126, 234, 0.4)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(45deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 35px rgba(102, 126, 234, 0.6)`
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {loading ? '⏳ Inscription en cours...' : '🚀 S\'inscrire comme Agence'}
          </Button>
        </form>
        
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500
          }}
        >
          Déjà un compte ? {' '}
          <Box 
            component="a" 
            href="/login" 
            sx={{ 
              color: VIOLET_BLUE, 
              textDecoration: 'none', 
              fontWeight: 700,
              '&:hover': { 
                color: VIOLET_PURPLE,
                textDecoration: 'underline'
              } 
            }}
          >
            Connectez-vous ici
          </Box>
        </Typography>
      </Paper>
      <AlertSnackbar 
        open={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        severity={error ? 'error' : 'success'} 
        message={error || success} 
      />
    </Box>
  );t PRIMARY_COLOR = '#1e3c72';
const SECONDARY_COLOR = '#2a5298';
const VIOLET_BLUE = '#667eea';
const VIOLET_PURPLE = '#764ba2';
const ACCENT_RED = '#ff4d4f';

const categoriesList = ['Voyage', 'Quad', 'Excursions', 'Tourisme', 'Autres'];

const RegisterAgency = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '', description: '', logo: null, categories: [], role: 'agency' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setForm({ ...form, logo: e.target.files[0] });
  };

  const handleCategoriesChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, categories: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'categories') {
          value.forEach((cat, idx) => formData.append(`categories[${idx}]`, cat));
        } else {
          formData.append(key, value);
        }
      });
      await register(formData);
      setSuccess('Inscription agence réussie ! Statut en attente de validation.');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’inscription agence');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      sx={{
        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 25%, ${VIOLET_BLUE} 50%, ${VIOLET_PURPLE} 75%, ${PRIMARY_COLOR} 100%)`,
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          minWidth: 450, 
          maxWidth: 550,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 4,
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              background: `linear-gradient(45deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            🏢 Inscription Agence
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontWeight: 500 
            }}
          >
            Rejoignez notre plateforme professionnelle
          </Typography>
        </Box>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField 
            label="Nom de l'agence" 
            name="name" 
            fullWidth 
            margin="normal" 
            required 
            value={form.name} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR, borderWidth: 2 },
                '& input': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: PRIMARY_COLOR }
              }
            }}
          />
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            fullWidth 
            margin="normal" 
            required 
            value={form.email} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 },
                '& input': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: VIOLET_BLUE }
              }
            }}
          />
          <TextField 
            label="Téléphone" 
            name="phone" 
            fullWidth 
            margin="normal" 
            required 
            value={form.phone} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: VIOLET_PURPLE, borderWidth: 2 },
                '& input': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: VIOLET_PURPLE }
              }
            }}
          />
          <TextField 
            label="Mot de passe" 
            name="password" 
            type="password" 
            fullWidth 
            margin="normal" 
            required 
            value={form.password} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR, borderWidth: 2 },
                '& input': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: PRIMARY_COLOR }
              }
            }}
          />
          <TextField 
            label="Confirmer le mot de passe" 
            name="password_confirmation" 
            type="password" 
            fullWidth 
            margin="normal" 
            required 
            value={form.password_confirmation} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: VIOLET_BLUE, borderWidth: 2 },
                '& input': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: VIOLET_BLUE }
              }
            }}
          />
          <TextField 
            label="Description de l'agence" 
            name="description" 
            fullWidth 
            margin="normal" 
            multiline 
            rows={3} 
            value={form.description} 
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: VIOLET_PURPLE, borderWidth: 2 },
                '& textarea': { color: 'white', fontWeight: 500 }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: VIOLET_PURPLE }
              }
            }}
          />
          <Box sx={{ mt: 3, mb: 2 }}>
            <InputLabel 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 600, 
                mb: 1, 
                fontSize: '1rem' 
              }}
            >
              📷 Logo de l'agence
            </InputLabel>
            <OutlinedInput 
              type="file" 
              name="logo" 
              onChange={handleLogoChange} 
              fullWidth
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR, borderWidth: 2 }
              }} 
            />
          </Box>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <InputLabel 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 600, 
                mb: 2, 
                fontSize: '1rem' 
              }}
            >
              🎯 Catégories de services
            </InputLabel>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {categoriesList.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(cat)
                        ? prev.categories.filter((c) => c !== cat)
                        : [...prev.categories, cat],
                    }));
                  }}
                  sx={{
                    backgroundColor: form.categories.includes(cat) 
                      ? `linear-gradient(45deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`
                      : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    color: form.categories.includes(cat) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    border: form.categories.includes(cat) 
                      ? `2px solid ${VIOLET_BLUE}` 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: form.categories.includes(cat) ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: form.categories.includes(cat) 
                        ? `linear-gradient(45deg, ${VIOLET_PURPLE}, ${VIOLET_BLUE})`
                        : 'rgba(255, 255, 255, 0.15)',
                      transform: 'scale(1.05)',
                      boxShadow: `0 8px 25px rgba(102, 126, 234, 0.3)`
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Inscription...' : 'S’inscrire'}
          </Button>
        </form>
        <Typography variant="body2" mt={2} color="text.secondary">
          Déjà un compte ? <a href="/login">Connectez-vous</a>
        </Typography>
      </Paper>
      <AlertSnackbar open={alertOpen} onClose={() => setAlertOpen(false)} severity={error ? 'error' : 'success'} message={error || success} />
    </Box>
  );
};

export default RegisterAgency;
