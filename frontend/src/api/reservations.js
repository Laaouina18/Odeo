import apiFetch from './apiFetch';

export async function getReservations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/reservations${query ? `?${query}` : ''}`);
}

export async function createReservation(data) {
  return apiFetch('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getReservation(id) {
  return apiFetch(`/reservations/${id}`);
}

export async function updateReservation(id, data) {
  return apiFetch(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteReservation(id) {
  return apiFetch(`/reservations/${id}`, {
    method: 'DELETE',
  });
}
