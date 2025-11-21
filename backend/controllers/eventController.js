import {
    createEventService,
    getEventIdByName,
    createEventRoleService,
    deleteEventService,
    getEventByIdService,
    getEventsService,
    getFeaturedEventsService,
    updateEventService,
    registerForEventService,
    unregisterForEventService,
    getVolunteersForEventService,
    getFinalistsService,
    getRunnersService,
    getParticipantsService
} from "../services/eventService.js"
import pool from "../server.js";


export const getEvents = async (req, res) => {
    try {
        const {
            sortBy,
            radius,
            lat,
            lng,
            minParticipants,
            dateFilter,
            startDate,
            endDate
        } = req.query;

        const events = await getEventsService({ 
            sortBy,
            radius,
            lat,
            lng,
            minParticipants,
            dateFilter,
            startDate,
            endDate
        });
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
    
    // Set role limits for the event
    // Because event_id is automatically generated and event names are unique,
    // we are able to find our new event's id from its name
    const eventIdContainer = await getEventIdByName(eventData.name);
    const eventId = eventIdContainer.event_id;

    await createEventRoleService(eventId, "Runner", eventData.max_runners);
    await createEventRoleService(eventId, "Starting Official", eventData.max_start_officials);
    await createEventRoleService(eventId, "Finish Line Official", eventData.max_finish_officials);

    // Add arbitrarily high limit for generic volunteers
    // 30k is used because 32,767 is the max limit for small signed ints, which
    // the event_role limit is
    await createEventRoleService(eventId, "Volunteer", 30000);

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
    const { id } = req.params;
    const eventData = req.body;
    
    const { sponsors, prizes, ...eventFields } = eventData;

    const updatedEvent = await updateEventService(id, eventFields);
    
    if (!updatedEvent || updatedEvent.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (sponsors !== undefined || prizes !== undefined) {
      await pool.query(
        'DELETE FROM event_sponsors WHERE event_id = $1',
        [id]
      );
      
      if (sponsors || prizes) {
        await pool.query(
          'INSERT INTO event_sponsors (event_id, sponsor, prize) VALUES ($1, $2, $3)',
          [id, sponsors || null, prizes || null]
        );
      }
    }
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
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
    const { user_id, role } = req.body;

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


export const getVolunteers = async(req, res) => {
  const { eventId } = req.params;
  try {

    const volunteers = await getVolunteersForEventService(eventId)
    const count = volunteers.length
    res.status(200).json({volunteers, count})

  } catch {
    res.status(400).json({
        error: "failed to retrieve list of volunteers for this event"
    })
  } 
}


export const getFinalists = async (req, res) => {
  const { eventId } = req.params;
  try {
    const runners = await getFinalistsService(eventId)
    const count = runners.length
    res.status(200).json({runners, count})
  } catch (error) {
    console.error("Controller error retrieving finalists:", error);
    res.status(400).json({ error: "failed to retrieve list of finalists for this event"})
  }
}


export const getRunners = async (req, res) => {
  const { eventId } = req.params;

  try {
    const runners = await getRunnersService(eventId)
    const count = runners.length
    res.status(200).json({runners, count})
  } catch (error) {
    console.error("Controller error retrieving runners:", error);
    res.status(400).json({ error: "failed to retrieve list of runners for this event"})
  }
}


export const getParticipants = async (req, res) => {
  const { eventId } = req.params;
  try {
    const participants = await getParticipantsService(eventId)
    const count = participants.length
    res.status(200).json({participants, count})
  } catch {
    console.error("Error in controller when retrieving all participants for this event")
    res.status(400).json({error: "failed to retrieve all participants"})
  }
}

