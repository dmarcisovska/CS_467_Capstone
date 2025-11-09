import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
    createRacerQrCode,
    updateStartTime,
    updateFinishTime
} from "../controllers/racedayController.js";

const router = express.Router();

export default function racedayRoutes(pool) {
    const authMiddleware = authenticateToken(pool);

    router.get("/make-qr", authMiddleware, createRacerQrCode);
    router.patch("/set-start-time", authMiddleware, updateStartTime);
    router.get("/set-finish-time", authMiddleware, updateFinishTime);

    return router;
}
