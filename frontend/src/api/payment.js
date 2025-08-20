import api from './axios';

export const processPayment = (data) => api.post('/payment', data);
export const getInvoice = (bookingId) => api.get(`/invoice/${bookingId}`);
