import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  People,
  Business,
  EventNote,
  MonetizationOn,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getUserFromStorage } from '../../utils/storage';

import { DashboardSkeleton, StatsCardSkeleton, ChartSkeleton } from '../../components/SkeletonLoader';
import apiFetch from '../../api/apiFetch';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [services, setServices] = useState([]);
  const [commissionData, setCommissionData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'client',
    password: ''
  });

  // Palette de couleurs professionnelle
  const PRIMARY_COLOR = '#1e3c72';
  const SECONDARY_COLOR = '#2a5298';
  const VIOLET_BLUE = '#667eea';
  const VIOLET_PURPLE = '#764ba2';
  const ACCENT_RED = '#ff4d4f';
  
  const COLORS = [
    `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
    `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`,
    `linear-gradient(135deg, ${ACCENT_RED}, #ff7875)`,
    `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`
  ];

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData && userData.role === 'admin') {
      setUser(userData);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques admin
      const statsResponse = await apiFetch('/admin-stats');
      setStats(statsResponse.stats || {});

      // Charger toutes les réservations
      const reservationsResponse = await apiFetch('/admin-reservations');
      const reservationsData = reservationsResponse.reservations || [];
      setReservations(reservationsData);

      // Charger tous les utilisateurs
      const usersResponse = await apiFetch('/admin/users');
      setUsers(usersResponse.users || []);

      // Charger toutes les agences
      const agenciesResponse = await apiFetch('/admin/agencies');
      setAgencies(agenciesResponse.agencies || []);

      // Charger tous les services
      const servicesResponse = await apiFetch('/services');
      setServices(servicesResponse.data?.data || servicesResponse.services || []);

      // Calculer les données de commission (20% de chaque réservation)
      const commissions = reservationsData
        .filter(r => r.status === 'confirmed')
        .map(r => ({
          id: r.id,
          amount: r.total_price * 0.2,
          date: r.reservation_date,
          service: r.service?.title || 'Service inconnu'
        }));
      setCommissionData(commissions);

      // Calculer les données mensuelles
      const monthlyCommissions = {};
      commissions.forEach(c => {
        const month = new Date(c.date).toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyCommissions[month] = (monthlyCommissions[month] || 0) + c.amount;
      });

      const monthlyArray = Object.entries(monthlyCommissions).map(([month, amount]) => ({
        month,
        commission: amount,
        reservations: reservationsData.filter(r => {
          const rMonth = new Date(r.reservation_date).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'short' 
          });
          return rMonth === month && r.status === 'confirmed';
        }).length
      }));

      setMonthlyData(monthlyArray);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des données',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const endpoint = editingUser ? `/admin/users/${editingUser.id}` : '/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(newUser)
      });

      setSnackbar({
        open: true,
        message: editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès',
        severity: 'success'
      });

      setOpenUserDialog(false);
      setEditingUser(null);
      setNewUser({ name: '', email: '', role: 'client', password: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création/modification',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
      setSnackbar({
        open: true,
        message: 'Utilisateur supprimé avec succès',
        severity: 'success'
      });
      loadDashboardData();
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setNewUser({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      password: ''
    });
    setOpenUserDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'agency': return 'warning';
      case 'client': return 'primary';
      default: return 'default';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price || 0);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  // Afficher le skeleton pendant le chargement des données
  if (loading) {
    return <DashboardSkeleton />;
  }

  const pieData = [
    { name: 'Clients', value: users.filter(u => u.role === 'client').length },
    { name: 'Agences', value: users.filter(u => u.role === 'agency').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length }
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 },
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 250, 252, 0.95) 25%,
        rgba(241, 245, 249, 0.9) 50%,
        rgba(226, 232, 240, 0.95) 100%
      )`,
      backdropFilter: 'blur(20px)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05, ${ACCENT_RED}03)`,
        zIndex: -1,
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        p: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `0 8px 32px ${PRIMARY_COLOR}10, 0 4px 16px rgba(0, 0, 0, 0.05)`
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.8rem', md: '2.5rem' }
        }}>
          Dashboard Admin
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}15, ${VIOLET_BLUE}10)`,
          p: 2,
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Avatar sx={{
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
            fontWeight: 600
          }}>
            {user.name.charAt(0)}
          </Avatar>
          <Typography variant="h6" sx={{ 
            color: PRIMARY_COLOR,
            fontWeight: 600 
          }}>
            {user.name}
          </Typography>
        </Box>
      </Box>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
            borderRadius: 4,
            boxShadow: `0 12px 40px ${PRIMARY_COLOR}25, 0 6px 20px rgba(0, 0, 0, 0.08)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 20px 60px ${PRIMARY_COLOR}35, 0 10px 30px rgba(0, 0, 0, 0.15)`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            },
            '&:hover::after': {
              top: -30,
              right: -30,
              width: 140,
              height: 140,
            }
          }}>
            <CardContent sx={{ color: 'white', p: 3, position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    mb: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' 
                  }}>
                    {stats.total_users || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95, 
                    fontWeight: 500,
                    textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' 
                  }}>
                    Total Utilisateurs
                  </Typography>
                </Box>
                <People sx={{ 
                  fontSize: 48, 
                  opacity: 0.9,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  transition: 'transform 0.3s ease',
                  '.MuiCard-root:hover &': {
                    transform: 'scale(1.1) rotate(5deg)'
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${VIOLET_BLUE} 0%, ${VIOLET_PURPLE} 100%)`,
            borderRadius: 4,
            boxShadow: `0 12px 40px ${VIOLET_BLUE}25, 0 6px 20px rgba(0, 0, 0, 0.08)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 20px 60px ${VIOLET_BLUE}35, 0 10px 30px rgba(0, 0, 0, 0.15)`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            },
            '&:hover::after': {
              top: -30,
              right: -30,
              width: 140,
              height: 140,
            }
          }}>
            <CardContent sx={{ color: 'white', p: 3, position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    mb: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' 
                  }}>
                    {stats.total_agencies || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95, 
                    fontWeight: 500,
                    textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' 
                  }}>
                    Total Agences
                  </Typography>
                </Box>
                <Business sx={{ 
                  fontSize: 48, 
                  opacity: 0.9,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  transition: 'transform 0.3s ease',
                  '.MuiCard-root:hover &': {
                    transform: 'scale(1.1) rotate(-5deg)'
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${ACCENT_RED} 0%, #ff7875 100%)`,
            borderRadius: 4,
            boxShadow: `0 12px 40px ${ACCENT_RED}25, 0 6px 20px rgba(0, 0, 0, 0.08)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 20px 60px ${ACCENT_RED}35, 0 10px 30px rgba(0, 0, 0, 0.15)`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            },
            '&:hover::after': {
              top: -30,
              right: -30,
              width: 140,
              height: 140,
            }
          }}>
            <CardContent sx={{ color: 'white', p: 3, position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    mb: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' 
                  }}>
                    {formatPrice(stats.total_commission || 0)}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95, 
                    fontWeight: 500,
                    textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' 
                  }}>
                    Commissions Totales (20%)
                  </Typography>
                </Box>
                <MonetizationOn sx={{ 
                  fontSize: 48, 
                  opacity: 0.9,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  transition: 'transform 0.3s ease',
                  '.MuiCard-root:hover &': {
                    transform: 'scale(1.1) rotate(10deg)'
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${SECONDARY_COLOR} 0%, ${VIOLET_BLUE} 100%)`,
            borderRadius: 4,
            boxShadow: `0 12px 40px ${SECONDARY_COLOR}25, 0 6px 20px rgba(0, 0, 0, 0.08)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: `0 20px 60px ${SECONDARY_COLOR}35, 0 10px 30px rgba(0, 0, 0, 0.15)`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            },
            '&:hover::after': {
              top: -30,
              right: -30,
              width: 140,
              height: 140,
            }
          }}>
            <CardContent sx={{ color: 'white', p: 3, position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    mb: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' 
                  }}>
                    {stats.total_reservations || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95, 
                    fontWeight: 500,
                    textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' 
                  }}>
                    Total Réservations
                  </Typography>
                </Box>
                <EventNote sx={{ 
                  fontSize: 48, 
                  opacity: 0.9,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  transition: 'transform 0.3s ease',
                  '.MuiCard-root:hover &': {
                    transform: 'scale(1.1) rotate(-10deg)'
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques de commission */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            boxShadow: `0 12px 40px ${PRIMARY_COLOR}15, 0 6px 20px rgba(0, 0, 0, 0.05)`,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: `0 16px 50px ${PRIMARY_COLOR}20, 0 8px 25px rgba(0, 0, 0, 0.08)`,
              transform: 'translateY(-2px)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE}, ${ACCENT_RED})`,
            }
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`
              }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: PRIMARY_COLOR,
                fontSize: '1.3rem'
              }}>
                Évolution des Commissions par Mois
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${PRIMARY_COLOR}15`} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: PRIMARY_COLOR, fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: `${PRIMARY_COLOR}30` }}
                />
                <YAxis 
                  tick={{ fill: PRIMARY_COLOR, fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: `${PRIMARY_COLOR}30` }}
                />
                <Tooltip 
                  formatter={(value) => formatPrice(value)}
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${PRIMARY_COLOR}30`,
                    borderRadius: 12,
                    boxShadow: `0 8px 32px ${PRIMARY_COLOR}20`
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke={PRIMARY_COLOR}
                  strokeWidth={4}
                  name="Commission"
                  dot={{ 
                    fill: PRIMARY_COLOR, 
                    strokeWidth: 3, 
                    r: 6,
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }}
                  activeDot={{ 
                    r: 10, 
                    fill: ACCENT_RED,
                    stroke: '#fff',
                    strokeWidth: 3,
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            boxShadow: `0 12px 40px ${VIOLET_BLUE}15, 0 6px 20px rgba(0, 0, 0, 0.05)`,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: `0 16px 50px ${VIOLET_BLUE}20, 0 8px 25px rgba(0, 0, 0, 0.08)`,
              transform: 'translateY(-2px)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE}, ${PRIMARY_COLOR})`,
            }
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${VIOLET_BLUE}, ${VIOLET_PURPLE})`
              }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: VIOLET_BLUE,
                fontSize: '1.3rem'
              }}>
                Répartition des Utilisateurs
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[PRIMARY_COLOR, VIOLET_BLUE, ACCENT_RED][index % 3]}
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${VIOLET_BLUE}30`,
                    borderRadius: 12,
                    boxShadow: `0 8px 32px ${VIOLET_BLUE}20`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Onglets de gestion */}
      <Paper sx={{ 
        width: '100%',
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(30px)',
        boxShadow: `0 12px 40px ${PRIMARY_COLOR}10, 0 6px 20px rgba(0, 0, 0, 0.05)`,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE}, ${ACCENT_RED})`,
        }
      }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}05, ${VIOLET_BLUE}03)`,
          position: 'relative'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                color: PRIMARY_COLOR,
                minHeight: 64,
                transition: 'all 0.3s ease',
                position: 'relative',
                '&.Mui-selected': {
                  color: PRIMARY_COLOR,
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}12, ${VIOLET_BLUE}08)`,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    right: '20%',
                    height: 3,
                    background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                    borderRadius: '3px 3px 0 0',
                  }
                },
                '&:hover': {
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}08, ${VIOLET_BLUE}05)`,
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label="Utilisateurs" />
            <Tab label="Réservations" />
          </Tabs>
        </Box>

        {/* Onglet Utilisateurs */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: PRIMARY_COLOR
            }}>
              Gestion des Utilisateurs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenUserDialog(true)}
              sx={{
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 4px 15px ${PRIMARY_COLOR}30`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
                }
              }}
            >
              Ajouter Utilisateur
            </Button>
          </Box>

          <TableContainer sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: `0 8px 32px ${PRIMARY_COLOR}08, 0 4px 16px rgba(0, 0, 0, 0.02)`,
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}12, ${VIOLET_BLUE}08)`,
                  '& .MuiTableCell-head': {
                    borderBottom: `2px solid ${PRIMARY_COLOR}20`,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${PRIMARY_COLOR}30, transparent)`,
                    }
                  }
                }}>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: PRIMARY_COLOR,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Nom</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: PRIMARY_COLOR,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Email</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: PRIMARY_COLOR,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Rôle</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: PRIMARY_COLOR,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Date création</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: PRIMARY_COLOR,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem, index) => (
                  <TableRow 
                    key={userItem.id}
                    sx={{
                      '&:hover': {
                        background: `linear-gradient(135deg, ${PRIMARY_COLOR}06, ${VIOLET_BLUE}04)`,
                        transform: 'scale(1.005)',
                        boxShadow: `0 4px 20px ${PRIMARY_COLOR}15`,
                      },
                      transition: 'all 0.3s ease',
                      borderBottom: `1px solid ${PRIMARY_COLOR}10`,
                      '&:nth-of-type(even)': {
                        background: `${PRIMARY_COLOR}02`,
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ 
                          mr: 2,
                          background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${VIOLET_BLUE})`,
                          fontWeight: 600,
                          width: 40,
                          height: 40,
                          boxShadow: `0 4px 12px ${PRIMARY_COLOR}30`,
                          border: '2px solid rgba(255, 255, 255, 0.8)'
                        }}>
                          {userItem.name.charAt(0)}
                        </Avatar>
                        <Typography fontWeight={600} sx={{ color: 'text.primary' }}>
                          {userItem.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500 
                      }}>
                        {userItem.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={userItem.role} 
                        color={getRoleColor(userItem.role)} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500 
                      }}>
                        {new Date(userItem.created_at).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Modifier utilisateur" arrow>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditUser(userItem)}
                          sx={{
                            color: PRIMARY_COLOR,
                            borderRadius: 2,
                            background: `${PRIMARY_COLOR}08`,
                            border: `1px solid ${PRIMARY_COLOR}20`,
                            '&:hover': {
                              background: `${PRIMARY_COLOR}15`,
                              transform: 'scale(1.1) rotate(5deg)',
                              boxShadow: `0 4px 12px ${PRIMARY_COLOR}30`,
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Onglet Réservations */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600,
            color: PRIMARY_COLOR,
            mb: 3
          }}>
            Toutes les Réservations
          </Typography>
          <TableContainer sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: `0 8px 32px ${VIOLET_BLUE}08, 0 4px 16px rgba(0, 0, 0, 0.02)`,
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  background: `linear-gradient(135deg, ${VIOLET_BLUE}12, ${VIOLET_PURPLE}08)`,
                  '& .MuiTableCell-head': {
                    borderBottom: `2px solid ${VIOLET_BLUE}20`,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${VIOLET_BLUE}30, transparent)`,
                    }
                  }
                }}>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Client</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Service</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Date</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Montant</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Commission (20%)</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: VIOLET_BLUE,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation, index) => (
                  <TableRow 
                    key={reservation.id}
                    sx={{
                      '&:hover': {
                        background: `linear-gradient(135deg, ${VIOLET_BLUE}06, ${VIOLET_PURPLE}04)`,
                        transform: 'scale(1.005)',
                        boxShadow: `0 4px 20px ${VIOLET_BLUE}15`,
                      },
                      transition: 'all 0.3s ease',
                      borderBottom: `1px solid ${VIOLET_BLUE}10`,
                      '&:nth-of-type(even)': {
                        background: `${VIOLET_BLUE}02`,
                      }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600} sx={{ color: 'text.primary' }}>
                        {reservation.user?.name || reservation.guest_name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500 
                      }}>
                        {reservation.service?.title || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500 
                      }}>
                        {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} sx={{
                        color: PRIMARY_COLOR,
                        background: `${PRIMARY_COLOR}10`,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        display: 'inline-block',
                        border: `1px solid ${PRIMARY_COLOR}20`
                      }}>
                        {formatPrice(reservation.total_price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 700,
                          background: `linear-gradient(135deg, ${ACCENT_RED}, #ff7875)`,
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          display: 'inline-block',
                          boxShadow: `0 2px 8px ${ACCENT_RED}30`,
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {formatPrice(reservation.total_price * 0.2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={reservation.status}
                        color={
                          reservation.status === 'confirmed' ? 'success' :
                          reservation.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Dialog Créer/Modifier Utilisateur */}
      <Dialog 
        open={openUserDialog} 
        onClose={() => setOpenUserDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 16px 48px ${PRIMARY_COLOR}20, 0 8px 24px rgba(0, 0, 0, 0.1)`,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}15, ${VIOLET_BLUE}10)`,
          color: PRIMARY_COLOR,
          fontWeight: 600,
          fontSize: '1.3rem'
        }}>
          {editingUser ? 'Modifier Utilisateur' : 'Créer Utilisateur'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Rôle"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  }
                }}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="agency">Agence</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                helperText={editingUser ? "Laissez vide pour ne pas changer" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setOpenUserDialog(false)}
            sx={{ 
              color: 'text.secondary',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: `0 4px 15px ${PRIMARY_COLOR}30`,
              '&:hover': {
                background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${VIOLET_BLUE})`,
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
              }
            }}
          >
            {editingUser ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
