import { BASE_URL } from "../server.js";
import { createQrCode } from "../services/qrCodeService.js";
import { updateFinishTimeService } from "../services/racedayService.js"

/**
 * Returns the SVG code for a QR code that identifies a user in an event. 
 * 
 * Usage: GET http://localhost:8080/api/raceday/make-qr?event=7&user=23
 */
export const createRacerQrCode = async (req, res) => {
    try {
        const { event, user } = req.query; // URL query params

        // Set the destination URL as the endpoint that sets finish times 
        const qrCodeUrl = (
            "https://cs467capstone.up.railway.app" +
            `/api/raceday/set-finish-time?event=${event}&user=${user}`
        );
        const qrCode = await createQrCode(qrCodeUrl);

        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(qrCode);
    } catch (error) {
        console.log(`Failed to generate QR code: ${error}`);
        res.status(500);
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
        
        // Return specific HTTP codes based on the error message 
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