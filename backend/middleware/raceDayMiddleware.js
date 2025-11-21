import pool from "../server.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/**
 * Gets the avatar for the specified user.
 * @param {string} userId The user_id (uuid) to fetch the avatar for. 
 * @returns {Promise<Object>} Object containing avatar buffer and metadata.
 */
export const getProfilePictureRepository = async (userId) => {
  const result = await pool.query(`
    SELECT avatar, avatar_meta
    FROM users
    WHERE user_id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Profile picture not found");
  }

  const row = result.rows[0];

  if (!row.avatar) {
    throw new Error("Profile picture not found");
  }

  return {
    pictureBlob: row.avatar,
    mimeType: row.avatar_meta.mimeType,
    fileName: row.avatar_meta.originalName,
  };
};

/**
 * Updates the avatar for the specified user in the database.
 * @param {Object} pictureData The avatar image to write to the database.
 * @returns {Promise<Object>} Hash containing success (bool) and updated row.
 */
export const patchProfilePictureRepository = async (pictureData) => {
  const metadata = {
    userId: pictureData.userId,
    originalName: pictureData.originalName,
    mimeType: pictureData.mimeType,
    size: pictureData.size,
    uploadDate: new Date().toISOString(),
  };

  const result = await pool.query(`
    UPDATE users
    SET avatar = $1, avatar_meta = $2
    WHERE user_id = $3
    RETURNING *
    `,
    [pictureData.pictureBlob, JSON.stringify(metadata), pictureData.userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return {
    success: true,
    data: result.rows[0],
  };
};