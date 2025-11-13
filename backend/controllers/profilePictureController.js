import { patchProfilePictureService, getProfilePictureService } from "../services/profilePictureService.js";
import pool from "../server.js";


export const patchProfilePictureById = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No file uploaded'})
    }

    const userId = req.params.user_id;

    const pictureData = {
      userId: userId,
      pictureBlob: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    };

    if (!userId) {
      return res.status(400).json({error: "No user_id"})
    }

    // Save file to disk
    const profilePicture = await patchProfilePictureService(pictureData);

    // Build URL from env or current request host
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/api/profile-picture/${userId}`;

    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE user_id = $2',
      [avatarUrl, userId]
    );

    // Return avatar_url so frontend can use it
    res.status(200).json({
      success: true,
      avatar_url: avatarUrl,
      message: 'Avatar uploaded successfully'
    });

  } catch (error) {
    console.error("Error uploading photo", error);
    res.status(500).json({error: "Failed to upload photo"}); 
  }
}

export const getProfilePictureById = async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({error: "No user id"})
    }

    const profilePicture = await getProfilePictureService(userId);

    res.set('Content-Type', profilePicture.mimeType);   // MIME Type should be image files
    res.send(profilePicture.pictureBlob);

  } catch (error) {
    console.error("Error fetching profile picture", error);
    res.status(500).json({error: "Failed to fetch profile picture"})
  }
}
