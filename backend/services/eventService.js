import * as eventRepository from "../repositories/eventRepository.js";

export const getEventsService = async (filters) => {
  
  // Business Logic like validation/filtering etc.
  
    return await eventRepository.getEventsRepository(filters);
};

export const getFeaturedEventsService = async () => {

  return await eventRepository.getFeaturedEventsRepository();
};

export const createEventService = async (eventData) => {
  return await eventRepository.createEventRepository(eventData);
}

export const updateEventService = async (eventId, newData) => {
  return await eventRepository.updateEventRepository(eventId, newData);
}

export const deleteEventService = async (eventId) => {
  return await eventRepository.deleteEventRepository(eventId);
}

export const registerForEventService = async (eventId, userId, role) => {
  try {
    return await eventRepository.registerForEventRepository(eventId, userId, role);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
      const err = new Error("User already registered")
      err.status = 409
      throw err;
      
  }

}

export const unregisterForEventService = async (eventId, userId) => {
  const deleteRow = await eventRepository.unregisterForEventRepository(eventId, userId);
  if (!deleteRow) {
    const error = new Error("User was not registered for the event")
    error.status = 404;
    throw error;
  }
}

export const getEventByIdService = async (eventId) => {
  try {
    const eventObj = await eventRepository.getEventByIdRepository(eventId);

    if (!eventObj) {
      const error = new Error(`Unable to find event: ${eventId}`);
      error.status = 404;
      throw error;
    }

    return eventObj;

  } catch (error) {
    console.error("Error in service layer", error.message);
    throw error;
  }
} 
