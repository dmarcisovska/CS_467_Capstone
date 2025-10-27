import * as eventRepository from "../repositories/eventRepository.js";

export const getEventsService = async (filters) => {
  
  // Business Logic like validation/filtering etc.
  
    return await eventRepository.getEventsRepository(filters);
};

export const getFeaturedEventsService = async () => {

  return await eventRepository.getFeaturedEventsRepository();
};


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