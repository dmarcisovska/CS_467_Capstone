import { BASE_URL } from "../server.js";
import { createQrCode } from "../services/qrCodeService.js";
import { verifyUserEventRole } from "../services/authService.js";
import {
    updateStartTimeService,
    updateFinishTimeService
} from "../services/racedayService.js"

/**
 * Returns the SVG code for a QR code that identifies a user in an event.
 * 
 * Expects `event` (number) and `user` (uuid) as URL query parameters.
 * Returns an SVG if successful, otherwise a JSON with the error message.
 */
export const createRacerQrCode = async (req, res) => {
    try {
        const { event, user } = req.query;
        const { currentUser } = req.user;

        // Validate all inputs are provided
        if (!event || !user) {
            return res.status(400).json({ // Bad Request
                error: "Event and user are required" 
            });
        }
        // Check if user matches JWT; cannot create QR code for someone else
        // TODO: Refactor to remove user as a query parameter; fetch from JWT
        // directly; update downstream dependencies to no longer pass `user`
        if (user !== currentUser) {
            return res.status(403).json({ // Forbidden
                error: "Cannot create QR codes for other users" 
            });
        }
        // Check if user has `Runner` role for the provided event
        const isRunner = verifyUserEventRole(currentUser, event, ["Runner"]);
        if (!isRunner) {
            return res.status(403).json({ // Forbidden
                error: "User must be a runner on the event"
            });
        }

        // Build URL and generate QR code embedded with that URL
        const qrCodeUrl = `${BASE_URL}/api/raceday/set-finish-time?event=${event}&user=${user}`;
        const qrCode = await createQrCode(qrCodeUrl);

        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(qrCode);

    } catch {
        res.status(500).json({ error: "Failed to generate QR code" });
    }
}
export const updateStartTime = async (req, res) => {
    try {
        const { event } = req.query;
        const { currentUser } = req.user;
        
        // Only Starting Officials can start races
        const isRunner = verifyUserEventRole(
            currentUser,
            event,
            ["Starting Official"]
        );
        if (!isRunner) {
            return res.status(403).json({ // Forbidden
                error: "Only Starting Officials can start races"
            });
        }

        // Update start time
        const success = await updateStartTimeService(event);        
        if (success) {
            return res.status(200).json({ 
                message: "Start time recorded successfully" 
            });
        } else {
            return res.status(404).json({ 
                error: "Event not found or start time already set" 
            });
        }
    } catch (error) {
        console.error("Error updating finish time:", error);
        
        // Return specific HTTP codes based on error message to improve tracing 
        // TODO: Convert to a map/lookup for better scalability
        if (error.message === "Event is required") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Event not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Start time already recorded") {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ 
            error: "Failed to update start time" 
        });
    }
}
/**
 * Controller for updating a user's finish time for a given event.
 * 
 * Expects `event` (number) and `user` (uuid) as URL query parameters.
 * Returns a JSON indicating the update operation's success or failure.
 */
export const updateFinishTime = async (req, res) => {
    try {
        const { event, user } = req.query;
        const { currentUser } = req.user;
        
        // Only Finish Line Officials can record runners' finish times
        const isRunner = verifyUserEventRole(
            currentUser,
            event,
            ["Finish Line Official"]
        );
        if (!isRunner) {
            return res.status(403).json({ // Forbidden
                error: "Only Finish Line Officials can record finish times"
            });
        }

        const success = await updateFinishTimeService(event, user);        
        if (success) {
            return res.status(200).json({ 
                message: "Finish time recorded successfully" 
            });
        } else {
            return res.status(404).json({ 
                error: "Registration not found or finish time already set" 
            });
        }
    } catch (error) {
        console.error("Error updating finish time:", error);
        
        // Return specific HTTP codes based on error message to improve tracing 
        // TODO: Convert to a map/lookup for better scalability
        if (error.message === "Registration not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Finish time already recorded") {
            return res.status(409).json({ error: error.message });
        }
        if (error.message === "Event and user are required") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ 
            error: "Failed to update finish time" 
        });
    }
};
