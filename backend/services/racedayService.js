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

        // Handles invalid user inputs. Because user is a UUID, invalid values
        // throw a database error, bypassing the `if (!registration)` check.
        // This is a less-than-ideal implementation because it catches *all*
        // database failures, which can lead to mis-labeling other errors.
        // TODO: See if there is a better way to implement this
        if (error.message?.toLowerCase().includes("database operation failed")) {
            throw new Error("Registration not found");
        }
        throw error; // return the specific error to racedayController.js
    }
};
