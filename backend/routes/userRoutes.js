import "dotenv/config";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const router = express.Router();



export default function userRoutes(pool, authMiddleware) {
  // POST login a user
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // check if they gave email or password
      if (!email || !password) {
        return res.status(400).json({error: 'email/password required'});
      }
  
      // look for user
      const allUsers = await pool.query(`
      SELECT * FROM users 
      WHERE email = $1 AND is_deleted = FALSE
      `, [email]);

      // none found
      if (allUsers.rows.length ===0 ) {
        return res.status(401).json({error: 'wrong email/password'})
      }

      // found user
      // user_id, email, password_hash, username, avatar_url, is_deleted
      const user = allUsers.rows[0];

      // check password
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({error: 'invalid password'});
      }

      // create jwt token
      const token = jwt.sign(
        {user_id: user.user_id, email: user.email}, 
        // eslint-disable-next-line
        process.env.JWT_SECRET_KEY,
        {expiresIn: '7d'}
      )

      res.json({
        message: 'login successful',
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          avatar_url: user.avatar_url
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    }
  });

  // POST register a user
  router.post('/register', async (req, res) => {
    try {
      const {email, password, username} = req.body;

      // check if any blank inputs from user
      if (!email || !password || !username) {
        return res.status(400).json({error: 'one or more inputs were empty'});
      }

      // check password length
      if (password.length < 8) {
        return res.status(400).json({error: 'password too short. (8 or more)'})
      }
      
      // check if user exists
      const tempUser = await pool.query(`
        SELECT * FROM users
        WHERE email = $1 OR username = $2
      `, [email, username]);

      // check if tempUser exists
      if (tempUser.rows.length !== 0) {
        return res.status(400).json({Error: 'email or username already exists'});
      }

      // hash password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user into database
      const newUser = await pool.query(`
        INSERT INTO users (email, password_hash, username)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, username, created_at
      `, [email, hashedPassword, username]);

      // new user
      const user = newUser.rows[0];

      // success
      res.status(200).json({
        message: 'user registered successfully',
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          is_deleted: user.is_deleted
        }
      });

    } catch (error) { 
      console.error(error);
      res.status(500).json({error: 'server error'});
    }
  })

  // GET current user
  router.get('/profile/:user_id', authMiddleware, async (req, res) => {
    try {
      const { user_id } = req.params;

      // check if user exists
      const users = await pool.query(`
        SELECT user_id, email, username, avatar_url, created_at
        FROM users
        WHERE user_id = $1 AND is_deleted = false
      `, [user_id]);

      res.json(users.rows[0]);

    } catch (error) {
      console.error(error);
      res.status(500).json({error: 'server error'});
    }
  })

  // UPDATE a user
  router.put('/profile/:user_id', authMiddleware, async (req, res) => {
    try {
      const {user_id} = req.params;
      const {username, avatar_url, password} = req.body;

      if (req.user.user_id !== user_id) {
        return res.status(403).json({error: 'cannot delete, wrong account'});
      }

      const existingUser = await pool.query(`
        SELECT * 
        FROM users
        WHERE user_id = $1 AND is_deleted = false
        `, [user_id]
      );

      // check if user already exists
      if (existingUser.rows.length === 0) {
        return res.status(404).json({error: 'user not found'});
      }

      let newHashedPassword = null;
      if (password) {
        newHashedPassword = await bcrypt.hash(password, 10);
      }

      // update username, password, or avatar_url, if they gave one
      const updatedUser = await pool.query(`
        UPDATE users
        SET username = COALESCE($1, username),
          password_hash = COALESCE($2, password_hash),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = NOW()
        WHERE user_id = $4 AND is_deleted = false
        RETURNING user_id, email, username, avatar_url, updated_at
      `, [username || null, newHashedPassword || null, avatar_url || null, user_id]);

      res.json({
        message: 'user updated sucessfully',
        user:updatedUser.rows[0]
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({error: 'server error'});
    }
  })

    // DELETE a user
    router.put('/profile/delete/:user_id', authMiddleware, async (req, res) => {
      const {user_id} = req.params;

      if (req.user.user_id !== user_id) {
        return res.status(403).json({error: 'cannot edit, wrong account'});
      }

      const existingUser = await pool.query(`
        SELECT * 
        FROM users
        WHERE user_id = $1 AND is_deleted = false
        `, [user_id]
      );
      // check if user already exists
      if (existingUser.rows.length === 0) {
        return res.status(404).json({error: 'user not found'});
      }

      // update the user info
      // set is_deleted to true
      const updatedUser = await pool.query(`
        UPDATE users
        SET is_deleted = true,
          updated_at = NOW()
        WHERE user_id = $1 AND is_deleted = false
        RETURNING user_id, updated_at, is_deleted
      `, [user_id]);

      res.json({
        message: 'user deleted sucessfully',
        user:updatedUser.rows[0]
      })

    });

  return router;
}