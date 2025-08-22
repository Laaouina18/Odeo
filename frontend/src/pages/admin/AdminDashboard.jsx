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
  MenuItem
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
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

  const COLORS = ['rgb(129, 39, 85)', 'rgba(129, 39, 85, 0.8)', 'rgba(129, 39, 85, 0.6)', 'rgba(129, 39, 85, 0.4)'];

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Admin - {user.name}
      </Typography>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgb(129, 39, 85) 0%, rgba(129, 39, 85, 0.8) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.4)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_users || 0}
                  </Typography>
                  <Typography variant="body2">
                    Total Utilisateurs
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.9) 0%, rgba(129, 39, 85, 0.7) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.35)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_agencies || 0}
                  </Typography>
                  <Typography variant="body2">
                    Total Agences
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.8) 0%, rgba(129, 39, 85, 0.6) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.3)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPrice(stats.total_commission || 0)}
                  </Typography>
                  <Typography variant="body2">
                    Commissions Totales (20%)
                  </Typography>
                </Box>
                <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.7) 0%, rgba(129, 39, 85, 0.5) 100%)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(129, 39, 85, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(129, 39, 85, 0.25)',
            }
          }}>
            <CardContent sx={{ color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_reservations || 0}
                  </Typography>
                  <Typography variant="body2">
                    Total Réservations
                  </Typography>
                </Box>
                <EventNote sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques de commission */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des Commissions par Mois
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  name="Commission"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Répartition des Utilisateurs
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Onglets de gestion */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Utilisateurs" />
            <Tab label="Réservations" />
          </Tabs>
        </Box>

        {/* Onglet Utilisateurs */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Gestion des Utilisateurs</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenUserDialog(true)}
            >
              Ajouter Utilisateur
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Date création</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>{userItem.name.charAt(0)}</Avatar>
                        {userItem.name}
                      </Box>
                    </TableCell>
                    <TableCell>{userItem.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={userItem.role} 
                        color={getRoleColor(userItem.role)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(userItem.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditUser(userItem)}
                      >
                        <EditIcon />
                      </IconButton>
                   
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Onglet Réservations */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Toutes les Réservations</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Commission (20%)</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      {reservation.user?.name || reservation.guest_name || 'N/A'}
                    </TableCell>
                    <TableCell>{reservation.service?.title || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{formatPrice(reservation.total_price)}</TableCell>
                    <TableCell>
                      <Typography color="success.main" fontWeight="bold">
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
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Modifier Utilisateur' : 'Créer Utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Rôle"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateUser} variant="contained">
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
