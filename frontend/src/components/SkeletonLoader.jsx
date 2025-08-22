import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

// Skeleton pour les cartes de services
export const ServiceCardSkeleton = () => (
  <Card className="glass-card" sx={{ height: '100%', borderRadius: 4 }}>
    <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '16px 16px 0 0' }} />
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width={60} height={24} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
    </CardContent>
  </Card>
);

// Skeleton pour les cartes statistiques
export const StatsCardSkeleton = () => (
  <Card className="glass-card">
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
    </CardContent>
  </Card>
);

// Skeleton pour les listes
export const ListItemSkeleton = () => (
  <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
    <Box display="flex" alignItems="center" gap={2}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box flexGrow={1}>
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
    </Box>
  </Box>
);

// Skeleton pour les tables
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} style={{ padding: '16px' }}>
        <Skeleton variant="text" width="80%" height={20} />
      </td>
    ))}
  </tr>
);

// Skeleton pour les graphiques
export const ChartSkeleton = ({ height = 300 }) => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
    <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
  </Box>
);

// Skeleton pour la page d'accueil
export const HomePageSkeleton = () => (
  <Box>
    {/* Hero Section Skeleton */}
    <Box sx={{ 
      minHeight: 400, 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, rgba(129, 39, 85, 0.1) 0%, rgba(129, 39, 85, 0.05) 100%)',
      p: 4
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center', width: '100%' }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={28} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="70%" height={28} sx={{ mx: 'auto', mb: 4 }} />
        <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 3 }} />
      </Box>
    </Box>

    {/* Services Section Skeleton */}
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Box textAlign="center" mb={6}>
        <Skeleton variant="text" width="40%" height={48} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
      </Box>
      
      <Grid container spacing={4}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ServiceCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

// Skeleton pour les dashboards
export const DashboardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    {/* Titre */}
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    
    {/* Cartes statistiques */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCardSkeleton />
        </Grid>
      ))}
    </Grid>
    
    {/* Graphique */}
    <Card className="glass-card" sx={{ mb: 4 }}>
      <ChartSkeleton />
    </Card>
    
    {/* Tableau */}
    <Card className="glass-card">
      <CardContent>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="rectangular" width="15%" height={20} />
            <Skeleton variant="rectangular" width="25%" height={20} />
            <Skeleton variant="rectangular" width="20%" height={20} />
            <Skeleton variant="rectangular" width="15%" height={20} />
            <Skeleton variant="rectangular" width="25%" height={20} />
          </Box>
        ))}
      </CardContent>
    </Card>
  </Box>
);

// Skeleton pour la page de détail
export const ServiceDetailSkeleton = () => (
  <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card className="glass-card" sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '16px 16px 0 0' }} />
          <CardContent sx={{ p: 4 }}>
            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
            <Box display="flex" gap={2} mb={3}>
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
            </Box>
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />
            
            <Box display="flex" gap={3} mb={3}>
              <Box>
                <Skeleton variant="text" width={60} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={80} height={24} />
              </Box>
              <Box>
                <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card className="glass-card">
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default {
  ServiceCardSkeleton,
  StatsCardSkeleton,
  ListItemSkeleton,
  TableRowSkeleton,
  ChartSkeleton,
  HomePageSkeleton,
  DashboardSkeleton,
  ServiceDetailSkeleton
};
