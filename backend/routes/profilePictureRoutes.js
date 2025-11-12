import express from "express";
import multer from "multer";
import { getProfilePictureById, patchProfilePictureById } from "../controllers/profilePictureController.js";


const router = express.Router();

// configuration for multer file uploader
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1 * 512 * 512 }, // 5kb limit
  fileFilter: (req, file, cb) => {  
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Can only use image files'), false);
    }
    cb(null, true);
  }
});


// GET specific profile picture for a specfic user
router.get("/:user_id", getProfilePictureById);

// PATCH a profile picture
router.patch("/:user_id", upload.single('profilePicture'), patchProfilePictureById);

export default router;