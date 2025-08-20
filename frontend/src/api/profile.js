import { apiFetch } from './axios';

// Agency profile CRUD
export const getAgencyProfile = () => apiFetch('/agency/profile', { method: 'GET' });
export const updateAgencyProfile = (data) => {
	const agencyId = localStorage.getItem('agency_id');
	if (!agencyId) throw new Error('agency_id not found in localStorage');
	if (data.logo && typeof data.logo === 'object') {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('phone', data.phone || '');
		formData.append('description', data.description || '');
		formData.append('logo', data.logo);
		return apiFetch(`/agency/profile/${agencyId}`, { method: 'POST', body: formData });
	} else {
        localStorage.removeItem('agency'); // Clear agency from localStorage if no logo
        localStorage.setItem('agency', JSON.stringify(data));
		return apiFetch(`/agency/profile/${agencyId}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
	}
};
export const deleteAgencyProfile = () => {
	const agencyId = localStorage.getItem('agency_id');
	if (!agencyId) throw new Error('agency_id not found in localStorage');
	return apiFetch(`/agency/profile/${agencyId}`, { method: 'DELETE' });
};

// Client profile CRUD
export const getClientProfile = () => {
	const user = localStorage.getItem('user');
	const userId = user ? JSON.parse(user).id : null;
	if (!userId) throw new Error('user id not found in localStorage');
	return apiFetch(`/client/profile/${userId}`, { method: 'GET' });
};
export const updateClientProfile = (data) => {
	const user = localStorage.getItem('user');
	const userId = user ? JSON.parse(user).id : null;
	if (!userId) throw new Error('user id not found in localStorage');
	return apiFetch(`/client/profile/${userId}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
};
export const deleteClientProfile = () => {
	const user = localStorage.getItem('user');
	const userId = user ? JSON.parse(user).id : null;
	if (!userId) throw new Error('user id not found in localStorage');
	return apiFetch(`/client/profile/${userId}`, { method: 'DELETE' });
};
