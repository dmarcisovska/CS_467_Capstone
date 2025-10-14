import "dotenv/config";
import express from "express";
import cors from "cors";
import postgres from "postgres";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// process.env
// eslint-disable-next-line
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
export default sql;

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// DB connection tests; use the requests.http file
app.get("/users", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/users", async (req, res) => {
  try {

    // TODO: Implement actual password hashing

    const { username, email, passwordHash } = req.body;
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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});