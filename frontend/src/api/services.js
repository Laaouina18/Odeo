import { apiFetch } from './axios';

export const fetchServices = () => apiFetch('/services', { method: 'GET' });
export const getService = (id) => apiFetch(`/services/${id}`, { method: 'GET' });
export const createService = (data) => apiFetch('/services', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
export const updateService = (id, data) => apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
export const deleteService = (id) => apiFetch(`/services/${id}`, { method: 'DELETE' });
