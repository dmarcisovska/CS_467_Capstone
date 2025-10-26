import {
    updateFinishTime,
    getRegistration
} from "../repositories/racedayRepository.js";

/**
 * Validates inputs against the registration before updating the finish time.
 * @param {number} event The event_id that the user is registered for.
 * @param {string} user The user_id whose finish time is being updated.
 * @returns {boolean} True if the operation succeeds, otherwise false.
 */
export const updateFinishTimeService = async (event, user) => {
    
    if (!event || !user) {
        throw new Error("Event and user are required");
    }
    try {
        const registration = await getRegistration(event, user);
        
        // Check if registration exists
        if (!registration) {
            throw new Error("Registration not found");
        }
        // Check if finish time is already set
        if (registration.finish_time) {
            throw new Error("Finish time already recorded");
        }
        // Set finish time
        return await updateFinishTime(event, user);
        
    } catch (error) {
        console.error(
            "updateFinishTimeService database operation failed: ", error
        );
        throw new Error("Failed to update finish time: Database error");
    }
};
