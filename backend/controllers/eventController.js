import { createEventService, deleteEventService, getEventByIdService, getEventsService, getFeaturedEventsService, updateEventService } from "../services/eventService.js"



export const getEvents = async (req, res) => {
    try {
    const { sortBy, radius, lat, lng, minParticipants, dateFilter, startDate, endDate } = req.query;

    const events = await getEventsService({ sortBy, radius, lat, lng, minParticipants, dateFilter, startDate, endDate });
    res.status(200).json(events);

  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
        }
};

// returns top 3 events by participant count, if less than 3 events exist, will return however many exists < 3.
export const getFeaturedEvents = async (req, res) => {

  try {
    const featuredEvents = await getFeaturedEventsService();
    res.status(200).json(featuredEvents)
  } catch (err) {
    console.log("Error fetching featured events in controller", err)
    res.status(500).json({ error: "failed to fetch featured events"});
  }
};

export const createEvent = async (req, res) => {
  try {
    // should use the given data in the body
    const newEvent = await createEventService(req.body);
    res.status(200).json(newEvent);

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create" });
        }
}

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await getEventByIdService(eventId);

    res.status(200).json(event);
  } catch (error) {
    console.error("Error getting event by ID:", error);
    res.status(500).json({ error: "Failed to retrieve"});
  }
}

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const newData = req.body;

    const event = await updateEventService(eventId, newData);
    res.status(200).json(event);
  } catch (error) {
    console.error("Error updating event by ID:", error);
    res.status(500).json({ error: "Failed to update"});
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await deleteEventService(eventId);
    res.status(200).json(event);

  } catch (error) {
    console.error("Error deleting event by ID:", error);
    res.status(500).json({ error: "Failed to delete"});
    
  }
}
