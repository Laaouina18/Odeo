import apiFetch from './apiFetch';

// Réservations authentifiées
export async function getReservations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/reservations${query ? `?${query}` : ''}`);
}

export async function createReservation(data) {
  return apiFetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Réservations publiques (sans authentification)
export async function createPublicReservation(data) {
  const response = await fetch('http://localhost:8000/api/reservations/public', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création de la réservation');
  }
  
  return await response.json();
}

export async function getPublicReservation(id) {
  const response = await fetch(`http://localhost:8000/api/reservations/public/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération de la réservation');
  }
  
  return await response.json();
}

export async function getReservation(id) {
  return apiFetch(`/api/reservations/${id}`);
}

export async function updateReservation(id, data) {
  return apiFetch(`/api/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function deleteReservation(id) {
  return apiFetch(`/api/reservations/${id}`, {
    method: 'DELETE',
  });
}

export async function confirmReservation(id) {
  return apiFetch(`/api/reservations/${id}/confirm`, {
    method: 'POST',
  });
}

export async function cancelReservation(id) {
  return apiFetch(`/api/reservations/${id}/cancel`, {
    method: 'POST',
  });
}

export async function getReservationStats() {
  return apiFetch('/api/reservations-stats');
}
