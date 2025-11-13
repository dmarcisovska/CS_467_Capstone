import * as eventRepository from "../repositories/eventRepository.js";

export const getEventsService = async (filters) => {
  let { sortBy, radius, lat, lng, minParticipants, dateFilter, startDate, endDate } = filters;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new Error("startDate must be earlier than the provided endDate");
  }
  
  return await eventRepository.getEventsRepository(filters);
};

export const getFeaturedEventsService = async () => {

  const events = await eventRepository.getFeaturedEventsRepository();
  if (events.length === 0) {
    console.log("No featured events found, possible no event entries")
  }
  return events
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

  const roles = ['Runner', 'Starting Official', 'Finish Line Official']

  if (!roles.includes(role)) {
    const error = new Error("invalid role")
    error.status = 400;
    throw error
  }

  try {
    return await eventRepository.registerForEventRepository(eventId, userId, role);
  } catch (error) {
      const err = new Error("Error during registering for an event, user may already be registered")
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

export const getVolunteersForEventService = async (eventId) => {
  try {
    const volunteerList = await eventRepository.getVolunteerList(eventId);
    return volunteerList
  } catch (error) {
    console.error("Error when retrieving volunteer list", error.message);
    throw error;
  }
}

export const getFinalistsService = async (eventId) => {

  try {
    const runners = await eventRepository.getFinalistListRepository(eventId);
    return runners;
  } catch (error) {
    console.error("Error when retrieving finalist list", error);
    throw error;
  }
}

export const getRunnersService = async (eventId) => {

  try {
    const runners = await eventRepository.getRunnersListRepository(eventId)
    return runners;
  } catch (error) {
    console.error("Error when retrieving runners list", error);
    throw error;
  }
}


export const getParticipantsService = async (eventId) => {

  try {
    const participant = await eventRepository.getParticipantsRepository(eventId)
    return participant;
  } catch (error) {
    console.error("Error when retrieving particiant list", error);
    throw error;
  }
}