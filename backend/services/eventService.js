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

export const getEventByIdService = async (eventId) => {
  return await eventRepository.getEventByIdRepository(eventId);
}

export const updateEventService = async (eventId, newData) => {
  return await eventRepository.updateEventRepository(eventId, newData);
}

export const deleteEventService = async (eventId, newData) => {
  return await eventRepository.deleteEventRepository(eventId);
}