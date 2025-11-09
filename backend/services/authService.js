import { checkUserEventRole } from "../repositories/authRepository.js";

/**
 * Returns true if a user has the required role(s) for an event, else false.
 * @param {string} userId - UUID of the user
 * @param {number} eventId - ID of the event
 * @param {string[]} requiredRoles array of acceptable roles
 * @returns {Promise<boolean>}
 */
export const verifyUserEventRole = async (userId, eventId, requiredRoles) => {
    
    // Validate inputs
    if (!userId || !eventId) {
        throw new Error("User ID and Event ID are required");
    }
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
        throw new Error("requiredRoles must be a non-empty array");
    }
    
    // Verify user event role(s)
    for (const role of requiredRoles) {
        const hasRole = await checkUserEventRole(userId, eventId, role);
        if (hasRole) {
            return true;
        }
    }  
    return false;
};