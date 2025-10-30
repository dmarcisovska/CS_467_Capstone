import express from "express";
import {
    createRacerQrCode,
    updateStartTime,
    updateFinishTime
} from "../controllers/racedayController.js";

const router = express.Router();

router.get("/make-qr", createRacerQrCode)
router.patch("/set-start-time", updateStartTime)

// Uses GET instead of PATCH because QR codes trigger GET requests by default
router.get("/set-finish-time", updateFinishTime)

export default router;
