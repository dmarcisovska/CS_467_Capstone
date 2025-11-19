import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, getFeaturedEvents, updateEvent, registerForEvent, unregisterForEvent, updateRoleForEvent, getVolunteers, getFinalists, getRunners, getParticipants } from '../controllers/eventController.js';

const router = express.Router();
// Base Url: '/api/events/'

// GET all events with / without sorting/filters.
// Example: /api/events/  -> gets all events 
//          /api/events/?sortBy=date  - > gets all events sorted by date
router.get("/", getEvents)
router.get("/featuredevents", getFeaturedEvents)
router.post("/:eventId/register", registerForEvent)
router.delete("/:eventId/register/:userId", unregisterForEvent)

router.patch("/:eventId/update-role/:userId", updateRoleForEvent)

router.get("/:eventId/volunteers", getVolunteers)
router.get("/:eventId/finalists", getFinalists)
router.get("/:eventId/runners", getRunners)
router.get("/:eventId/participants", getParticipants)

// GET specific event uing id
router.get("/:event_id", getEventById)

// CREATE a new event
router.post("/", createEvent)

// UPDATE an existing event
router.put("/:id", updateEvent)

// DELETE an event
router.delete("/:id", deleteEvent)

export default router;