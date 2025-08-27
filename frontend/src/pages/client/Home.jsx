import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Chip, 
  Stack, 
  Card, 
  CardMedia, 
  CardContent,
  Container,
  Fade,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
  InputAdornment,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocationOn, 
  Search, 
  Close, 
  AccessTime, 
  Person, 
  Euro,
  Visibility,
  Phone,
  Email,
  Language,
  Star,
  ArrowForward
} from '@mui/icons-material';
import { getServices } from '../../api/services';
import { getCategories } from '../../api/categories';

// Ajout des animations CSS professionnelles avec nouvelle palette
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes professional-glow {
    0%, 100% { 
      text-shadow: 0 0 20px rgba(30, 60, 114, 0.6), 0 0 40px rgba(42, 82, 152, 0.4);
      filter: brightness(1);
    }
    50% { 
      text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 50px rgba(118, 75, 162, 0.6);
      filter: brightness(1.1);
    }
  }
  
  @keyframes elegant-pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4), 0 0 0 0 rgba(102, 126, 234, 0.3);
    }
    50% { 
      transform: scale(1.02);
      box-shadow: 0 0 0 15px rgba(30, 60, 114, 0.1), 0 0 0 30px rgba(102, 126, 234, 0.05);
    }
  }
  
  @keyframes smooth-float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
      opacity: 1;
    }
    33% { 
      transform: translateY(-8px) rotate(2deg);
      opacity: 0.9;
    }
    66% { 
      transform: translateY(-4px) rotate(-1deg);
      opacity: 0.95;
    }
  }
  
  @keyframes gradient-shift {
    0% { 
      background: linear-gradient(135deg, #1e3c72, #2a5298, #667eea);
    }
    50% { 
      background: linear-gradient(135deg, #667eea, #764ba2, #1e3c72);
    }
    100% { 
      background: linear-gradient(135deg, #1e3c72, #2a5298, #667eea);
    }
  }
  
  @keyframes professional-shimmer {
    0% { 
      background-position: -200% center;
      filter: brightness(1);
    }
    50% { 
      filter: brightness(1.05);
    }
    100% { 
      background-position: 200% center;
      filter: brightness(1);
    }
  }
  
  @keyframes card-hover {
    0%, 100% { 
      border-radius: 24px;
      transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
    }
    50% { 
      border-radius: 28px;
      transform: perspective(1000px) rotateX(2deg) rotateY(2deg);
    }
  }
  
  @keyframes professional-border {
    0%, 100% { 
      box-shadow: 
        0 0 10px rgba(30, 60, 114, 0.3),
        0 0 20px rgba(102, 126, 234, 0.2),
        inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
    50% { 
      box-shadow: 
        0 0 15px rgba(102, 126, 234, 0.4),
        0 0 25px rgba(118, 75, 162, 0.3),
        inset 0 0 15px rgba(255, 255, 255, 0.15);
    }
  }
  
  @keyframes glassmorphism-shine {
    0%, 100% { 
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 70%
      );
      transform: translateX(-100%);
    }
    50% { 
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(styleSheet);

const ITEMS_PER_PAGE = 12;
const PRIMARY_COLOR = '#1e3c72';
const SECONDARY_COLOR = '#2a5298';
const VIOLET_BLUE = '#667eea';
const VIOLET_PURPLE = '#764ba2';
const ACCENT_RED = '#ff4d4f';
const DESCRIPTION_PREVIEW_LENGTH = 100; // Longueur fixe pour uniformité

// Nouvelles images de haute qualité
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&auto=format',

'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&auto=format',

  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=400&h=280&fit=crop&auto=format',

  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop&auto=format',
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fonction pour afficher seulement deux mots + ...
  const truncateDescription = (text) => {
    if (!text) return 'Service disponible...';
    
    // Nettoyer le texte (supprimer les espaces en trop)
    const cleanText = text.trim();
    
    // Diviser en mots
    const words = cleanText.split(' ');
    
    // Prendre seulement les deux premiers mots
    if (words.length >= 2) {
      return words.slice(0, 2).join(' ') + '...';
    } else if (words.length === 1) {
      return words[0] + '...';
    } else {
      return 'Service disponible...';
    }
  };

  // Fonction pour obtenir une image aléatoire
  const getRandomImage = (index) => {
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  // Charger les services et catégories au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices({ status: 'active' }),
          getCategories()
        ]);
        setServices(servicesRes.data?.data || []);
        setCategories(categoriesRes.categories || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrage et recherche instantanée
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = !search || 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        (service.location && service.location.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = !selectedCategory || 
        service.category?.name === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, search, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Réinitialiser la page lors du changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(selectedCategory === cat ? '' : cat);
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedService(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box bgcolor="background.default" minHeight="100vh">
      {/* Hero Section professionnel et élégant */}
      <Box sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 12 }, 
        textAlign: 'center', 
        background: `
          linear-gradient(135deg, 
            ${PRIMARY_COLOR} 0%, 
            ${SECONDARY_COLOR} 50%, 
            ${VIOLET_BLUE} 100%
          )
        `,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.06) 0%, transparent 40%)
          `,
          pointerEvents: 'none'
        }
      }}>
        {/* Titre professionnel et moderne */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Typography 
              variant="h1" 
              fontWeight={800} 
              mb={4} 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                lineHeight: 1.2,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'professional-glow 4s ease-in-out infinite'
              }}
            >
              Découvrez des services
              <Box component="span" sx={{ 
                display: 'block',
                background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.8rem', lg: '4.8rem' },
                mt: 1,
                filter: 'drop-shadow(0 2px 10px rgba(102, 126, 234, 0.3))'
              }}>
                d'exception
              </Box>
            </Typography>
          </Fade>
          
          <Fade in timeout={1500}>
            <Typography 
              variant="h4" 
              mb={6} 
              sx={{ 
                fontSize: { xs: '1.3rem', md: '1.8rem' },
                fontWeight: 500,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              Explorez une sélection premium de services professionnels 
              <br />
              <Box component="span" sx={{ 
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 400,
                opacity: 0.85
              }}>
                Qualité garantie • Réservation sécurisée • Support 24/7
              </Box>
            </Typography>
          </Fade>

          <Fade in timeout={2000}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center', 
              borderRadius: 16,
              maxWidth: 600,
              margin: '0 auto',
              gap: { xs: 2, sm: 0 },
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(30, 60, 114, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 12px 40px rgba(30, 60, 114, 0.25), 0 6px 20px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <TextField
                placeholder="Rechercher votre service idéal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: 24
                      }} />
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    '& fieldset': { border: 'none' },
                    '& input': { 
                      py: 2,
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 500,
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Paper>
          </Fade>

          {/* Statistiques professionnelles et élégantes */}
          <Fade in timeout={2500}>
            <Box sx={{ 
              mt: 8, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 3, md: 6 }, 
              flexWrap: 'wrap'
            }}>
              {/* Stat 1 - Services */}
              <Box 
                textAlign="center" 
                sx={{
                  position: 'relative',
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animation: 'elegant-pulse 4s ease-in-out infinite',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    background: 'rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 12px 40px rgba(30, 60, 114, 0.3)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Typography variant="h1" fontWeight={800} sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))',
                  mb: 1
                }}>
                  {services.length}+
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}>
                  Services Premium
                </Typography>
              </Box>

              {/* Stat 2 - Catégories */}
              <Box 
                textAlign="center" 
                sx={{
                  position: 'relative',
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animation: 'elegant-pulse 4s ease-in-out infinite 1s',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    background: 'rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 12px 40px rgba(42, 82, 152, 0.3)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Typography variant="h1" fontWeight={800} sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(42, 82, 152, 0.3))',
                  mb: 1
                }}>
                  {categories.length}+
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}>
                  Catégories
                </Typography>
              </Box>

              {/* Stat 3 - Support */}
              <Box 
                textAlign="center" 
                sx={{
                  position: 'relative',
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animation: 'elegant-pulse 4s ease-in-out infinite 2s',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    background: 'rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 12px 40px rgba(255, 77, 79, 0.3)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Typography variant="h1" fontWeight={800} sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  background: `linear-gradient(135deg, ${ACCENT_RED}, #ff7875)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(255, 77, 79, 0.3))',
                  mb: 1
                }}>
                  24/7
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}>
                  Support Client
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Categories Section avec design professionnel */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          mb={2} 
          textAlign="center"
          sx={{ 
            color: PRIMARY_COLOR,
            fontSize: { xs: '2rem', md: '2.8rem' },
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Explorer par catégorie
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={5} textAlign="center" sx={{ 
          opacity: 0.8,
          fontSize: { xs: '1rem', md: '1.2rem' },
          maxWidth: 600,
          mx: 'auto'
        }}>
          Choisissez parmi nos catégories soigneusement sélectionnées
        </Typography>
        
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {categories.map((cat, index) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={selectedCategory === cat.name ? 'primary' : 'default'}
              onClick={() => handleCategoryClick(cat.name)}
              sx={{ 
                fontSize: { xs: 14, md: 16 }, 
                px: { xs: 2, md: 3 }, 
                py: { xs: 1, md: 1.5 },
                borderRadius: 25,
                height: { xs: 42, md: 48 },
                background: selectedCategory === cat.name 
                  ? `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})` 
                  : 'rgba(255, 255, 255, 0.9)',
                color: selectedCategory === cat.name ? 'white' : PRIMARY_COLOR,
                border: selectedCategory === cat.name ? 'none' : `2px solid ${VIOLET_BLUE}30`,
                fontWeight: 600,
                boxShadow: selectedCategory === cat.name 
                  ? `0 8px 25px ${PRIMARY_COLOR}30` 
                  : '0 4px 15px rgba(30, 60, 114, 0.1)',
                transform: selectedCategory === cat.name ? 'scale(1.02)' : 'scale(1)',
                '&:hover': { 
                  transform: selectedCategory === cat.name ? 'scale(1.05)' : 'scale(1.02)', 
                  boxShadow: selectedCategory === cat.name 
                    ? `0 12px 35px ${PRIMARY_COLOR}40` 
                    : `0 6px 20px ${VIOLET_BLUE}30`,
                  background: selectedCategory === cat.name 
                    ? `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})` 
                    : `linear-gradient(135deg, ${VIOLET_BLUE}15, rgba(255,255,255,0.95))`,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Services Section avec design glassmorphique professionnel */}
      <Box sx={{ 
        background: `
          linear-gradient(180deg, 
            rgba(30, 60, 114, 0.03) 0%, 
            rgba(102, 126, 234, 0.05) 50%, 
            rgba(118, 75, 162, 0.03) 100%
          )
        `,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231e3c72" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none'
        }
      }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight={800} 
                mb={1}
                sx={{ 
                  color: PRIMARY_COLOR,
                  fontSize: { xs: '2.2rem', md: '3.5rem' },
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Nos services premium
              </Typography>
              {!loading && (
                <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
                  {search && ` pour "${search}"`}
                  {selectedCategory && ` dans "${selectedCategory}"`}
                </Typography>
              )}
            </Box>
          </Box>

          <Grid container spacing={4}>
            {loading ? (
              // Skeleton modernisé
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                  <Paper 
                    sx={{ 
                      borderRadius: 4, 
                      height: 420, // Ajusté pour correspondre aux cartes de service
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }}
                  >
                    <Skeleton 
                      variant="rectangular" 
                      height={240}
                      sx={{ borderRadius: 0 }}
                      animation="wave"
                    />
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" width="90%" height={28} sx={{ mb: 2 }} animation="wave" />
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} animation="wave" />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} animation="wave" />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} animation="wave" />
                        <Skeleton variant="text" width="60%" height={18} animation="wave" />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Skeleton variant="rounded" width={80} height={28} animation="wave" />
                        <Skeleton variant="text" width="40%" height={24} animation="wave" />
                      </Box>
                      
                      <Skeleton variant="rounded" width="100%" height={45} animation="wave" />
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              paginatedServices.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={service.id}>
                  <Paper sx={{ 
                    borderRadius: 5, 
                    height: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    border: '1px solid rgba(30, 60, 114, 0.1)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(30, 60, 114, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 5,
                      padding: '1px',
                      background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE}, ${PRIMARY_COLOR})`,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'subtract',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      boxShadow: `0 20px 60px ${PRIMARY_COLOR}15, 0 8px 32px rgba(0,0,0,0.1)`,
                      border: `1px solid ${VIOLET_BLUE}30`,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}
                  onClick={() => handleServiceClick(service)}
                  >
                    <Box position="relative" sx={{ height: 240 }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={service.images && service.images.length > 0
                          ? `http://localhost:8000/storage/${service.images[0]}` 
                          : getRandomImage(index)
                        }
                        alt={service.title}
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                          '&:hover': { transform: 'scale(1.08)' }
                        }}
                      />
                      
                      {/* Badge prix professionnel */}
                      <Box
                        position="absolute"
                        top={16}
                        right={16}
                        sx={{
                          background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                          color: 'white',
                          borderRadius: 3,
                          px: 2.5,
                          py: 1,
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: `0 4px 15px ${PRIMARY_COLOR}30`,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          animation: 'smooth-float 4s ease-in-out infinite'
                        }}
                      >
                        {service.price} DH
                      </Box>

                      {/* Badge catégorie élégant */}
                      <Box
                        position="absolute"
                        bottom={16}
                        left={16}
                      >
                        <Chip 
                          label={service.category?.name || 'Service'} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: PRIMARY_COLOR,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            backdropFilter: 'blur(10px)',
                            boxShadow: `0 3px 12px ${VIOLET_BLUE}20`,
                            border: `1px solid ${VIOLET_BLUE}40`
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: 180 // Réduit car description plus courte
                    }}>
                      {/* Titre - hauteur fixe */}
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        mb={2}
                        sx={{ 
                          height: '3.2em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                          fontSize: '1.1rem',
                          color: 'text.primary'
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      {/* Description - hauteur fixe avec 2 mots seulement */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        mb={2}
                        sx={{ 
                          height: '1.5em', // Réduit car seulement 2 mots
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}
                      >
                        {truncateDescription(service.description)}
                      </Typography>
                      
                      {/* Localisation */}
                      <Box display="flex" alignItems="center" mb={3}>
                        <LocationOn sx={{ fontSize: 18, color: PRIMARY_COLOR, mr: 1 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem'
                          }}
                        >
                          {service.location || 'Lieu non spécifié'}
                        </Typography>
                      </Box>
                      
                      {/* Bouton premium avec effets visuels */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        endIcon={<ArrowForward />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/direct-booking/${service.id}`);
                        }}
                        sx={{ 
                          borderRadius: 3, 
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          py: 1.5,
                          background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                          boxShadow: `0 4px 15px ${PRIMARY_COLOR}25`,
                          border: '1px solid rgba(255,255,255,0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s ease'
                          },
                          '&:hover': {
                            background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 20px ${PRIMARY_COLOR}35`,
                            '&::before': {
                              left: '100%'
                            }
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Réserver maintenant
                      </Button>
                    </CardContent>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
          
          {/* Pagination élégante */}
          {!loading && totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column', 
              gap: 3, 
              mt: 8,
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Affichage de <strong>{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</strong> à <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)}</strong> sur <strong>{filteredServices.length}</strong> services
              </Typography>
              
              <Pagination 
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 44,
                    height: 44,
                    margin: '0 4px',
                    borderRadius: 3,
                    border: `2px solid transparent`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&.Mui-selected': {
                      backgroundColor: PRIMARY_COLOR,
                      color: 'white',
                      boxShadow: `0 4px 15px ${PRIMARY_COLOR}40`,
                      border: `2px solid ${PRIMARY_COLOR}`,
                      '&:hover': {
                        backgroundColor: PRIMARY_COLOR,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${PRIMARY_COLOR}50`
                      }
                    },
                    '&:hover': {
                      backgroundColor: `${PRIMARY_COLOR}10`,
                      border: `2px solid ${PRIMARY_COLOR}30`,
                      transform: 'translateY(-1px)'
                    }
                  }
                }}
              />
            </Box>
          )}
          
          {/* Message aucun résultat modernisé */}
          {!loading && filteredServices.length === 0 && (
            <Box textAlign="center" py={10}>
              <Typography variant="h4" color="text.secondary" mb={3} fontWeight={600}>
                {search || selectedCategory ? 'Aucun service trouvé' : 'Aucun service disponible'}
              </Typography>
              <Typography variant="h6" color="text.secondary" mb={5} sx={{ opacity: 0.8 }}>
                {search || selectedCategory 
                  ? 'Essayez de modifier vos critères de recherche' 
                  : 'Les agences peuvent ajouter leurs services via leur tableau de bord'
                }
              </Typography>
              {(search || selectedCategory) && (
                <Button 
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                  }}
                  sx={{ 
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.9))`,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Effacer les filtres
                </Button>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Dialog modernisé */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 6,
            boxShadow: '0 24px 80px rgba(0,0,0,0.12)'
          }
        }}
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ p: 0 }}>
              <Box position="relative">
                <CardMedia
                  component="img"
                  height="320"
                  image={selectedService.images && selectedService.images.length > 1
                    ? `http://localhost:8000/storage/${selectedService.images[1]}` 
                    : selectedService.images && selectedService.images.length > 0
                    ? `http://localhost:8000/storage/${selectedService.images[0]}` 
                    : getRandomImage(0)
                  }
                  alt={selectedService.title}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <Close />
                </IconButton>
                <Box
                  position="absolute"
                  bottom={20}
                  left={20}
                  sx={{
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.9))`,
                    color: 'white',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }}
                >
                  <Typography variant="h4" fontWeight={800}>
                    {selectedService.price} DH
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 5 }}>
              <Typography variant="h3" fontWeight={800} mb={3} sx={{ color: PRIMARY_COLOR }}>
                {selectedService.title}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={4} mb={4} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ fontSize: 24, color: PRIMARY_COLOR, mr: 1 }} />
                  <Typography variant="h6" fontWeight={500}>
                    {selectedService.location || 'Lieu non spécifié'}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedService.category?.name || 'Autre'} 
                  sx={{ 
                    backgroundColor: `${PRIMARY_COLOR}15`,
                    color: PRIMARY_COLOR,
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 2,
                    py: 1,
                    height: 40
                  }}
                />
              </Box>

              <Divider sx={{ my: 4, borderColor: `${PRIMARY_COLOR}20` }} />
              
              <Typography variant="h5" fontWeight={700} mb={3} sx={{ color: PRIMARY_COLOR }}>
                Description complète
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={5} lineHeight={1.8} fontSize="1.1rem">
                {selectedService.description}
              </Typography>

              <Grid container spacing={3}>
                {selectedService.duration && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" p={3} borderRadius={3} bgcolor="rgba(129, 39, 85, 0.05)">
                      <AccessTime sx={{ fontSize: 28, color: PRIMARY_COLOR, mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Durée
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {selectedService.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {selectedService.max_participants && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" p={3} borderRadius={3} bgcolor="rgba(129, 39, 85, 0.05)">
                      <Person sx={{ fontSize: 28, color: PRIMARY_COLOR, mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Max participants
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {selectedService.max_participants}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 5, pt: 2, gap: 2 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: PRIMARY_COLOR, 
                  color: PRIMARY_COLOR,
                  borderWidth: 2,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: PRIMARY_COLOR,
                    backgroundColor: `${PRIMARY_COLOR}10`,
                    borderWidth: 2
                  }
                }}
              >
                Fermer
              </Button>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => {
                  handleCloseDialog();
                  navigate(`/direct-booking/${selectedService.id}`);
                }}
                sx={{ 
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.9))`,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: `0 4px 15px ${PRIMARY_COLOR}30`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 1))`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`
                  }
                }}
              >
                Réserver maintenant
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Section Pourquoi Odeo - Redesignée avec style moderne */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography 
          variant="h3" 
          fontWeight={800} 
          mb={3} 
          textAlign="center"
          sx={{ 
            color: PRIMARY_COLOR,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Pourquoi choisir Odeo ?
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={8} textAlign="center" maxWidth={800} mx="auto" sx={{ opacity: 0.8 }}>
          Une plateforme moderne et sécurisée pour découvrir et réserver vos expériences préférées
        </Typography>
        
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              textAlign: 'center', 
              p: 5,
              borderRadius: 4,
              background: `linear-gradient(135deg, rgba(129, 39, 85, 0.05), rgba(129, 39, 85, 0.02))`,
              border: `2px solid rgba(129, 39, 85, 0.1)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 16px 40px ${PRIMARY_COLOR}15`,
                borderColor: `${PRIMARY_COLOR}30`
              }
            }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.8))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  boxShadow: `0 8px 25px ${PRIMARY_COLOR}30`
                }}
              >
                <Typography variant="h2" fontWeight={900} sx={{ color: 'white' }}>
                  {services.length}+
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} mb={3} sx={{ color: PRIMARY_COLOR }}>
                Services disponibles
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8} fontSize="1.1rem">
                Une large gamme d'activités soigneusement sélectionnées pour tous les goûts et budgets
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              textAlign: 'center', 
              p: 5,
              borderRadius: 4,
              background: `linear-gradient(135deg, rgba(129, 39, 85, 0.05), rgba(129, 39, 85, 0.02))`,
              border: `2px solid rgba(129, 39, 85, 0.1)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 16px 40px ${PRIMARY_COLOR}15`,
                borderColor: `${PRIMARY_COLOR}30`
              }
            }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.8))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  boxShadow: `0 8px 25px ${PRIMARY_COLOR}30`
                }}
              >
                <Typography variant="h2" fontWeight={900} sx={{ color: 'white' }}>
                  {categories.length}+
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} mb={3} sx={{ color: PRIMARY_COLOR }}>
                Catégories
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8} fontSize="1.1rem">
                Des expériences diversifiées dans tous les domaines pour satisfaire toutes vos envies
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              textAlign: 'center', 
              p: 5,
              borderRadius: 4,
              background: `linear-gradient(135deg, rgba(129, 39, 85, 0.05), rgba(129, 39, 85, 0.02))`,
              border: `2px solid rgba(129, 39, 85, 0.1)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 16px 40px ${PRIMARY_COLOR}15`,
                borderColor: `${PRIMARY_COLOR}30`
              }
            }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, rgba(129, 39, 85, 0.8))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  boxShadow: `0 8px 25px ${PRIMARY_COLOR}30`
                }}
              >
                <Typography variant="h2" fontWeight={900} sx={{ color: 'white' }}>
                  100%
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} mb={3} sx={{ color: PRIMARY_COLOR }}>
                Sécurisé
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8} fontSize="1.1rem">
                Réservations et paiements entièrement sécurisés avec une protection complète
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

  
    </Box>
  );
};

export default Home;