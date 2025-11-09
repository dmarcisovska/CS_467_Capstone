import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    createRacerQrCode,
    updateStartTime,
    updateFinishTime
} from "../controllers/racedayController.js";

const router = express.Router();

router.get("/make-qr", authenticateToken, createRacerQrCode)
router.patch("/set-start-time", authenticateToken, updateStartTime)

// Uses GET instead of PATCH because QR codes trigger GET requests by default
router.get("/set-finish-time", authenticateToken, updateFinishTime)

export default router;
