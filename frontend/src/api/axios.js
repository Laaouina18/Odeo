// Fetch-based API client for browser compatibility
const BASE_URL = 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const fetchOptions = { ...defaultOptions, ...options };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erreur API');
  }
  return response.json();
}
