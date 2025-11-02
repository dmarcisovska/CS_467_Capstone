import "dotenv/config";
import express from "express";
import cors from "cors";

import pg from "pg";
const { Pool } = pg;

import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import geocodeRoutes from "./routes/geocodeRoutes.js";

const app = express();
// eslint-disable-next-line
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    // eslint-disable-next-line
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

export default pool

app.get("/", (req, res) => {
    res.json({ message: "test deploy 6" });
});

// DB connection tests; use the requests.http file
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/users", async (req, res) => {
    try {
        // TODO: Implement actual password hashing

        const { username, email, passwordHash } = req.body;
        // eslint-disable-next-line
        const newUser = await sql`
            INSERT INTO users (username, email, password_hash)
            VALUES (${username}, ${email}, ${passwordHash})
            RETURNING *
        `;

        res.status(201).json(newUser[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes(pool));
app.use("/api/geocode", geocodeRoutes);

app.listen(PORT, () => {
    // eslint-disable-next-line
    const port = process.env.NODE_ENV || "development"
    console.log(`Server running on http://localhost:${PORT}`);
});