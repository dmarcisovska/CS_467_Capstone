import express from "express";
import {
    createRacerQrCode,
    updateFinishTime
} from "../controllers/racedayController.js";

const router = express.Router();

router.get("/make-qr", createRacerQrCode)
router.post("/set-finish-time", updateFinishTime)

export default router;
