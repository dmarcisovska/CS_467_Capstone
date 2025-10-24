import { getEventsService, getFeaturedEventsService } from "../services/eventService.js"



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