import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, getFeaturedEvents, updateEvent } from '../controllers/eventController.js';

const router = express.Router();
// Base Url: '/api/events/'

// GET all events with / without sorting/filters.
// Example: /api/events/  -> gets all events 
//          /api/events/?sortBy=date  - > gets all events sorted by date
router.get("/", getEvents)
router.get("/featuredevents", getFeaturedEvents)

// GET specific event uing id
router.get("/:id", getEventById)

// CREATE a new event
router.post("/", createEvent)

// UPDATE an existing event
router.put("/:id", updateEvent)

// DELETE an event
router.delete("/:id", deleteEvent)

export default router;