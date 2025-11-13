import { patchProfilePictureService, getProfilePictureService } from "../services/profilePictureService.js";
import pool from "../server.js";


export const patchProfilePictureById = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No file uploaded'})
    }

    const userId = req.params.user_id;

    // profile picture data
    const pictureData = {
      userId: userId,
      pictureBlob: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    };

    console.log(pictureData)

    if (!userId) {
      return res.status(400).json({error: "No user_id"})

    }

    const profilePicture = await patchProfilePictureService(pictureData);
    
    // Update user's avatar_url in database
    const avatarUrl = `${process.env.BASE_URL}/api/profile-picture/${userId}`;
    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE user_id = $2',
      [avatarUrl, userId]
    );
    
    res.status(200).json({
      ...profilePicture,
      avatar_url: avatarUrl
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
