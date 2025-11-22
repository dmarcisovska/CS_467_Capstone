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

export const getEventIdByName = async (eventName) => {
  return await eventRepository.getEventIdByNameRepository(eventName);
}

export const createEventRoleService = async (eventId, role, roleLimit) => {
  return await eventRepository.createEventRoleRepository(eventId, role, roleLimit);
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

export const updateRoleForEventService = async (eventId, userId, newRole) => {
  if (newRole === "Starting Official") {
    const existingVolunteers = await eventRepository.getVolunteerList(eventId);

    if (existingVolunteers) {
      const existingStartingOfficial = existingVolunteers.find(volunteer => volunteer.role === "Starting Official" && volunteer.user_id !== userId);

      if (existingStartingOfficial) {
        const error = new Error(`Event already has a Starting Official`);
        error.status = 409;
        throw error;
      }
    }

  }
  const updateRole = await eventRepository.updateRoleForEventRepository(eventId, userId, newRole);
  if (!updateRole) {
    const error = new Error("Could not update role for event")
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