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

const app = express();
const PORT = 8080;

// Set base URL depending on runtime environment
// eslint-disable-next-line
export const BASE_URL = process.env.BASE_URL;

app.use(cors());
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

// Routes
app.use("/api/user", userRoutes(pool));
app.use("/api/events", eventRoutes);
app.use("/api/raceday", racedayRoutes);

// Start server
pool.query("SELECT NOW()", (err) => {
    if (err) {
        console.error(`Database connection failed: ${err}`);
    
    } else {
        console.log("Database connection successful");
    }
});

app.use("/api/events", eventRoutes);

// authenication
const authMiddleware = authenticateToken(pool);

// user routes
// this has the authentication logic for now
app.use("/api/user", userRoutes(pool, authMiddleware));

app.use("/api/geocode", geocodeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}`);
});
