export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend error:', data);
      throw new Error(data.error || data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      throw new Error('Must be logged in to create event');
    }

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        creator_user_id: user.user_id,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create event');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      throw new Error('Must be logged in to update event');
    }

    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        creator_user_id: user.user_id,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update event');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      throw new Error('Must be logged in to delete event');
    }

    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete event');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Register a user for an event to /api/events/:eventId/register
export const registerForEvent = async (eventId, role = 'Runner') => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            throw new Error('Must be logged in to register for event');
        }
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.user_id,
                role: role,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to register for event');
        }
        return data;

    } catch (error) {
        console.error('Error registering for event:', error);
        throw error;
    }
};

export const unregisterFromEvent = async (eventId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            throw new Error('Must be logged in to unregister from event');
        }

        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register/${user.user_id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to unregister from event');
        }
        return data;

    } catch (error) {
        console.error('Error unregistering from event:', error);
        throw error;
    }
};

export const checkUserRegistration = async (eventId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      return { 
        isRunner: false, 
        isVolunteer: false, 
        isStartingOfficial: false,
        isFinishLineOfficial: false,
        currentRole: null 
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/participants`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to check registration status');
    }

    // Check if user is registered and determine their role
    const userRegistration = data.participants?.find(p => p.user_id === user.user_id);

    return {
      isRunner: userRegistration?.role === 'Runner',
      isVolunteer: userRegistration?.role === 'Volunteer',
      isStartingOfficial: userRegistration?.role === 'Starting Official',
      isFinishLineOfficial: userRegistration?.role === 'Finish Line Official',
      currentRole: userRegistration?.role || null
    };

  } catch (error) {
    console.error('Error checking registration:', error);
    return { 
      isRunner: false, 
      isVolunteer: false, 
      isStartingOfficial: false,
      isFinishLineOfficial: false,
      currentRole: null 
    };
  }
};
