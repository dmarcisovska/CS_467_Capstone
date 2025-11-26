import pool from "../server.js";

export const getUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1 AND is_deleted = false
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

export const getUserById = async (userId) => {
  const query = `
    SELECT *
    FROM users
    WHERE user_id = $1 AND is_deleted = false
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
}

export const createUser = async (email, hashedPassword, username) => {
  const query = `
    INSERT INTO users (email, password_hash, username)
    VALUES ($1, $2, $3)
    RETURNING user_id, email, username, created_at
  `;

  const { rows } = await pool.query(query, [email, hashedPassword, username]);
  return rows[0];
}

export const updateUserById = async (userId, updateData) => {
  const { username, avatar_url, password_hash } = updateData;

  const query = `
    UPDATE users
    SET username = COALESCE($1, username),
      password_hash = COALESCE($2, password_hash),
      avatar_url = COALESCE($3, avatar_url),
      updated_at = NOW()
    WHERE user_id = $4 AND is_deleted = false
    RETURNING user_id, email, username, avatar_url, updated_at
  `;

  const { rows } = await pool.query(query, [username, password_hash, avatar_url, userId]);
  return rows[0];
}

export const deleteUserById = async (userId) => {
  const query = `
    DELETE FROM users
    WHERE user_id = $1 AND is_deleted = false
    RETURNING *
  `;

  const { rows }= await pool.query(query, [userId]);
  return rows[0];
}