// API pour les réservations publiques (sans authentification)

// Créer une réservation publique (sans authentification)
export const createPublicReservation = async (reservationData) => {
  try {
    const response = await fetch('http://localhost:8000/api/reservations/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        service_id: parseInt(reservationData.serviceId),
        reservation_date: reservationData.date,
        start_time: reservationData.time,
        number_of_people: parseInt(reservationData.people),
        special_requests: reservationData.specialRequests
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de la réservation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur réservation:', error);
    throw error;
  }
};

// Récupérer une réservation publique par ID
export const getPublicReservation = async (id) => {
  try {
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
  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    throw error;
  }
};
