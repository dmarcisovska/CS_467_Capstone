import { findEvents } from "../repositories/eventRepository.js"

export const getEventsService = async (filters) => {
    const events = await findEvents(filters)
    return events;
}