import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  Business,
  AccountBalance,
  EventNote,
  Assessment
} from '@mui/icons-material';
import { getUserFromStorage } from '../../utils/storage';
import { apiFetch } from '../../api/apiFetch';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setStats(statsResponse.stats);

      // Charger toutes les réservations
      const reservationsResponse = await apiFetch('/admin-reservations');
      setReservations(reservationsResponse.reservations);

    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Administrateur
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Administrateur
      </Typography>

      {/* Statistiques Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <EventNote sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total_reservations || 0}
              </Typography>
              <Typography variant="body2">
                Total Réservations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total_revenue ? `${stats.total_revenue}` : '0'}
              </Typography>
              <Typography variant="body2">
                Chiffre d'Affaires (DH)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total_commission ? `${stats.total_commission}` : '0'}
              </Typography>
              <Typography variant="body2">
                Commissions (DH)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Business sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.agencies_count || 0}
              </Typography>
              <Typography variant="body2">
                Agences
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <CardContent sx={{ color: 'black', textAlign: 'center' }}>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.clients_count || 0}
              </Typography>
              <Typography variant="body2">
                Clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <CardContent sx={{ color: 'black', textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.services_count || 0}
              </Typography>
              <Typography variant="body2">
                Services
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques et Analyses */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Revenus par Mois
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '80%',
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              <Typography color="text.secondary">
                Graphique à implémenter
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Répartition des Réservations
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '80%',
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              <Typography color="text.secondary">
                Graphique circulaire à implémenter
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Métriques de Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Taux de Conversion
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Réservations Confirmées</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.total_reservations > 0 
                    ? Math.round((stats.confirmed_reservations || 0) / stats.total_reservations * 100)
                    : 0}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.total_reservations > 0 
                  ? (stats.confirmed_reservations || 0) / stats.total_reservations * 100
                  : 0}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Commission Moyenne
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {stats.total_reservations > 0
                ? Math.round((stats.total_commission || 0) / stats.total_reservations)
                : 0} DH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              par réservation
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Panier Moyen
            </Typography>
            <Typography variant="h4" color="secondary" fontWeight="bold">
              {stats.total_reservations > 0
                ? Math.round((stats.total_revenue || 0) / stats.total_reservations)
                : 0} DH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              par réservation
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tableau des Réservations Récentes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Réservations Récentes
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Client</strong></TableCell>
                <TableCell><strong>Service</strong></TableCell>
                <TableCell><strong>Agence</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Montant</strong></TableCell>
                <TableCell><strong>Commission</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.slice(0, 10).map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>#{reservation.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                        {reservation.user ? reservation.user.name.charAt(0) : 'G'}
                      </Avatar>
                      {reservation.user ? reservation.user.name : reservation.guest_name}
                    </Box>
                  </TableCell>
                  <TableCell>{reservation.service?.title || 'N/A'}</TableCell>
                  <TableCell>{reservation.service?.agency?.name || 'N/A'}</TableCell>
                  <TableCell>{reservation.reservation_date}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {reservation.total_price} DH
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="secondary">
                      {reservation.commission_amount || 0} DH
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
