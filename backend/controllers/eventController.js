import { getEventsService } from "../services/eventService.js"


export const getEvents = async (req, res) => {

    try {
        const events = await getEventsService();
        res.json(events)
    } catch (error) {
        console.error("Erorr", error)
        res.status(500).json({message: "Error when calling eventServices"})
    }
};