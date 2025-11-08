import * as eventRepository from "../repositories/eventRepository.js";

export const getEventsService = async (filters) => {
  
  // Business Logic like validation/filtering etc.
  
    return await eventRepository.getEventsRepository(filters);
};

export const getFeaturedEventsService = async () => {

  return await eventRepository.getFeaturedEventsRepository();
};


export const registerForEventService = async (eventId, userId, role) => {
  try {
    return await eventRepository.registerForEventRepository(eventId, userId, role);
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
