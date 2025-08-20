import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const fetchBookings = () => api.get('/bookings');
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
