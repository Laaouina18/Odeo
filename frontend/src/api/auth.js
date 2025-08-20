import { apiFetch } from './axios';

export const login = (data) => apiFetch('/login', {
	method: 'POST',
	body: JSON.stringify(data)
});

export const register = (data) => apiFetch('/register', {
	method: 'POST',
	body: JSON.stringify(data)
});

export const logout = () => apiFetch('/logout', {
	method: 'POST'
});

export const getMe = () => apiFetch('/me', {
	method: 'GET'
});
