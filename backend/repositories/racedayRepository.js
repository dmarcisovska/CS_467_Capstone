import pool from "../server.js";

/**
 * Updates the race finish time for a specific user in a given event.
 * @param {number} event The event_id that the user is registered for.
 * @param {string} user The user_id whose finish time is being updated.
 * @returns {boolean} True if the operation succeeds, otherwise false.
 */
export const updateFinishTime = async (event, user) => {
    try {
        const nowUtc = new Date().toISOString(); // returns UTC by default
        
        // we can ignore elapsed_time as it is a calculated interval
        const query = `
            UPDATE registrations
            SET finish_time = $1
            WHERE
                event_id = $2
                AND user_id = $3
                AND finish_time IS NULL;
        `;
        const result = await pool.query(query, [nowUtc, event, user]);
        return result.rowCount > 0;

    } catch (error) {
        console.error("setFinishTime database operation failed:", error);
        throw new Error("Database operation failed");
    }
}
/**
 * Returns the registration of a specific user for a given event.
 * @param {number} event The event_id that the user is registered for.
 * @param {string} user The user_id that is registered in the event.
 * @returns {object|null} The registration data, or null if no record exists.
 */
export const getRegistration = async (event, user) => {
    try {
        const query = `
            SELECT * FROM registrations
            WHERE
                event_id = $1
                AND user_id = $2;
        `;
        const result = await pool.query(query, [event, user]);
        return result.rows[0];

    } catch (error) {
        console.error("getRegistration database operation failed:", error);
        throw new Error("Database operation failed");
    }
};
