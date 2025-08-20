import api from './axios';

export const getAgenciesRevenue = () => api.get('/analytics/agencies-revenue');
export const getClientsEvolution = () => api.get('/analytics/clients-evolution');
export const getDashboardStats = () => api.get('/analytics/dashboard-stats');
