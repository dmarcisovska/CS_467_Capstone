import express from "express";
import {
    createRacerQrCode,
    updateFinishTime
} from "../controllers/racedayController.js";

const router = express.Router();

router.get("/make-qr", createRacerQrCode)

// Uses GET instead of POST because QR codes trigger GET requests by default
router.get("/set-finish-time", updateFinishTime)

export default router;
