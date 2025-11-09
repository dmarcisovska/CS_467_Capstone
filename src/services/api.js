const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const fetchEvents = async (filters = {}) => {
  try {

    const queryParams = new URLSearchParams();
    
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.dateFilter) queryParams.append('dateFilter', filters.dateFilter);
    if (filters.radius) queryParams.append('radius', filters.radius);
    if (filters.lat) queryParams.append('lat', filters.lat);
    if (filters.lng) queryParams.append('lng', filters.lng);
    if (filters.minParticipants) queryParams.append('minParticipants', filters.minParticipants);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const url = `${API_BASE_URL}/api/events${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchFeaturedEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/featuredevents`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured events');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
};

export const generateQRCode = async (eventId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/raceday/make-qr?event=${eventId}&user=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to generate QR code');
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const setStartTime = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/raceday/set-start-time?event=${eventId}`, {
      method: 'PATCH',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to set start time');
    }
    
    return data;
  } catch (error) {
    console.error('Error setting start time:', error);
    throw error;
  }
};

export const setFinishTime = async (eventId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/raceday/set-finish-time?event=${eventId}&user=${userId}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to set finish time');
    }
    
    return data;
  } catch (error) {
    console.error('Error setting finish time:', error);
    throw error;
  }
};

export const fetchEventById = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};