// api/services.js

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:8000/api';

// Fonction utilitaire pour les requêtes API
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // Pour inclure les cookies de session
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  // Fusionner les options
  const config = { ...defaultOptions, ...options };
  
  // Si on envoie des données JSON, ajouter le Content-Type
  // Pour FormData, ne pas définir Content-Type (le navigateur le fait automatiquement)
  if (options.body && typeof options.body === 'string') {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error = new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Service pour créer un nouveau service avec upload de fichiers
export const createService = async (data) => {
  // Si les données sont déjà en FormData, les utiliser directement
  if (data instanceof FormData) {
    return apiFetch('/services', {
      method: 'POST',
      body: data,
    });
  }
  
  // Sinon, envoyer en JSON pour les données sans fichiers
  return apiFetch('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Autres fonctions API
export const getServices = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/services?${queryString}` : '/services';
  return apiFetch(endpoint);
};

export const getService = (id) => {
  return apiFetch(`/services/${id}`);
};

export const updateService = async (id, data) => {
  // Si on a des images à uploader, utiliser FormData
  if (data.images && data.images.length > 0) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Pour Laravel
    
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        Array.from(data.images).forEach(image => {
          formData.append('images[]', image);
        });
      } else if (key === 'dates') {
        if (data.dates && Array.isArray(data.dates)) {
          data.dates.forEach((date, index) => {
            formData.append(`dates[${index}]`, date);
          });
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    return apiFetch(`/services/${id}`, {
      method: 'POST', // Utiliser POST avec _method=PUT pour Laravel
      body: formData,
    });
  } else {
    // Sinon, utiliser JSON
    return apiFetch(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

export const deleteService = (id) => {
  return apiFetch(`/services/${id}`, {
    method: 'DELETE',
  });
};

// Récupérer un service par ID avec dates disponibles
export const getServiceWithDates = async (id) => {
  try {
    const response = await apiFetch(`/services/${id}`);
    
    // Générer des dates disponibles pour les 30 prochains jours
    const availableDates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      availableDates.push(date.toISOString().split('T')[0]);
    }
    
    return {
      ...response,
      availableDates
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    throw error;
  }
};