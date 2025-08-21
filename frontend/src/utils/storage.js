// Utilitaires pour gérer les données utilisateur dans localStorage

export const getUserFromStorage = () => {
  try {
    const userItem = localStorage.getItem('user');
    return userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const getAgencyFromStorage = () => {
  try {
    const agencyItem = localStorage.getItem('agency');
    return agencyItem && agencyItem !== 'undefined' ? JSON.parse(agencyItem) : null;
  } catch (error) {
    console.error('Error parsing agency from localStorage:', error);
    localStorage.removeItem('agency');
    return null;
  }
};

export const getUserRole = () => {
  return localStorage.getItem('role');
};

export const getClientId = () => {
  return localStorage.getItem('client_id');
};

export const getAgencyId = () => {
  return localStorage.getItem('agency_id');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const user = getUserFromStorage();
  const token = getAuthToken();
  return !!user && !!token;
};

export const clearUserStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('agency_id');
  localStorage.removeItem('agency');
  localStorage.removeItem('client_id');
};

export const setUserStorage = (userData) => {
  const { user, token, role, agency } = userData;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  
  if (role === 'agency' && agency) {
    localStorage.setItem('agency_id', agency.id);
    localStorage.setItem('agency', JSON.stringify(agency));
  } else if (role === 'client') {
    localStorage.setItem('client_id', user.id);
    // Nettoyer les données d'agence si elles existent
    localStorage.removeItem('agency_id');
    localStorage.removeItem('agency');
  }
};
