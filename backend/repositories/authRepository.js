import pool from "../server.js";

/**
 * Returns true if a user is registered for an event with a specific role.
 * @param {string} userId UUID of the user
 * @param {number} eventId ID of the event
 * @param {string} role to check for
 * @returns {Promise<boolean>} True if user has the role in the event
 */
export const checkUserEventRole = async (userId, eventId, role) => {
    try {
        const query = `
            SELECT EXISTS (
                SELECT 1 
                FROM registrations 
                WHERE user_id = $1 
                AND event_id = $2 
                AND role = $3
            ) as has_role
        `;
        const result = await pool.query(query, [userId, eventId, role]);
        return result.rows[0].has_role;
    }
    catch (error) {
        console.error("checkUserEventRole database operation failed:", error);
        throw new Error("Database operation failed");
    }
};
