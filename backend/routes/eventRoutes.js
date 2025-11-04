import express from "express";
import { getEvents, getFeaturedEvents, registerForEvent, unregisterForEvent } from '../controllers/eventController.js';

const router = express.Router();
// Base Url: '/api/events/'

// GET all events with / without sorting/filters.
// Example: /api/events/  -> gets all events 
//          /api/events/?sortBy=date  - > gets all events sorted by date
router.get("/", getEvents)
router.get("/featuredevents", getFeaturedEvents)
router.post("/:eventId/register", registerForEvent)
router.delete("/:eventId/register/:userId", unregisterForEvent)
export default router;