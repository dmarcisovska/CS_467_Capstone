import { createQrCode } from "../services/qrCodeService.js";

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
 * This controller handles race-day events.
 */
export const updateFinishTime = async (req, res) => {
    try {
        // Get user_id and event_id
        const userId = "";
        const eventId = "";

        // Generate SQL
        const nowUtc = new Date().toUTCString();

        const updateFinishTimeSql = `
            UPDATE registrations
            SET finish_time = ${nowUtc}
            WHERE
                event_id = ${eventId}
                AND user_id = ${userId};
        `

        // Execute SQL
        console.log(updateFinishTimeSql);

        res.status(200);
    } catch {
        res.status(500).json({ error: "Failed to update finish time" });   
    }
}
