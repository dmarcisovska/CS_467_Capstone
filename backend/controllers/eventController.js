import { createEventService, deleteEventService, getEventByIdService, getEventsService, getFeaturedEventsService, updateEventService, registerForEventService, unregisterForEventService } from "../services/eventService.js"
import pool from "../server.js";


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
    const eventData = req.body;   
    const { sponsors, prizes, ...eventFields } = eventData;
    const newEvent = await createEventService(eventFields);
        if (sponsors || prizes) {
      await pool.query(
        `INSERT INTO event_sponsors (event_id, sponsor, prize)
         VALUES ($1, $2, $3)`,
        [newEvent[0].event_id, sponsors || null, prizes || null]
      );
    }
    
    res.status(201).json(newEvent);

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create" });
        }
}

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.event_id;

    const event = await getEventByIdService(eventId);
    res.status(200).json(event);

  } catch (error) {
    console.log("Error fetching the event", error);
    res.status(500).json({error: "Failed to fetch an event"});
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
};
    

export const registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    const {user_id, role} = req.body;

    try {
      const result = await registerForEventService(eventId, user_id, role)
      return res.status(201).json(result)
    } catch (error) {
      console.error("Register error:", error);

      return res.status(error.status = 400).json({
      error: error.message = "Already registered for this event"
    });
  }
};

export const unregisterForEvent = async (req, res) => {
  const { eventId, userId } = req.params;


  try {
      await unregisterForEventService(eventId, userId);
      res.status(200).json({ message: "Successfully unregistered"});

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
    res.status(400).json({ error: "failed to unregister from event"})
    }
  
};
