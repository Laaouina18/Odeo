const BASE_URL = 'http://localhost:8000';

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Ajouter le token d'authentification si disponible
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Construire l'URL complète
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, config);

    // Gérer les erreurs d'authentification
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('agency_id');
      window.location.href = '/login';
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    // Vérifier si la réponse est OK
    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Retourner la réponse JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

export default apiFetch;
