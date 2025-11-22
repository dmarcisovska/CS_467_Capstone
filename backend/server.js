import "dotenv/config";
import express from "express";
import cors from "cors";

import pg from "pg";
const { Pool } = pg;

import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authenticateToken from "./middleware/auth.js";
import racedayRoutes from "./routes/racedayRoutes.js";
import geocodeRoutes from "./routes/geocodeRoutes.js";
import profilePictureRoutes from "./routes/profilePictureRoutes.js";

const app = express();
// eslint-disable-next-line
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Set base URL depending on runtime environment
// eslint-disable-next-line
export const BASE_URL = process.env.BASE_URL;

app.use(cors({
  origin: [
    "https://crowd-sourced-racing-events.up.railway.app",   // frontend
    "http://localhost:5173"                                 // localhost
  ],
  credentials: true
}));


app.use(express.json());

// Database connection
const pool = new Pool({
    // eslint-disable-next-line
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

export default pool

app.get("/", (req, res) => {
    res.json({ message: "test deploy 6" });
});

// Start server
pool.query("SELECT NOW()", (err) => {
    if (err) {
        console.error(`Database connection failed: ${err}`);
    
    } else {
        console.log("Database connection successful");
    }
});

// authenication
const authMiddleware = authenticateToken(pool);

// user routes
// this has the authentication logic for now
app.use("/api/user", userRoutes(pool, authMiddleware));
app.use("/api/raceday", racedayRoutes(pool));
app.use("/api/events", eventRoutes);
app.use("/api/geocode", geocodeRoutes);

// profile picture routes
app.use("/api/profile-picture", profilePictureRoutes);

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
    if (BASE_URL) {
        console.log(`Public URL: ${BASE_URL}`);
    }
});
