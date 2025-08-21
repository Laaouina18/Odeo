// API pour récupérer les réservations d'un utilisateur spécifique
export const getUserReservations = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/user-reservations/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des réservations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    throw error;
  }
};

// Annuler une réservation
export const cancelUserReservation = async (reservationId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/reservations/cancel/${reservationId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'annulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur annulation:', error);
    throw error;
  }
};

// Modifier une réservation
export const updateUserReservation = async (reservationId, updateData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/reservations/update/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la modification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur modification:', error);
    throw error;
  }
};
