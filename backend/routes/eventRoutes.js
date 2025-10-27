import express from "express";
import { getEventById, getEvents, getFeaturedEvents } from '../controllers/eventController.js';

const router = express.Router();
// Base Url: '/api/events/'

// GET all events with / without sorting/filters.
// Example: /api/events/  -> gets all events 
//          /api/events/?sortBy=date  - > gets all events sorted by date
router.get("/", getEvents)
router.get("/featuredevents", getFeaturedEvents)
router.get("/:event_id", getEventById)

export default router;