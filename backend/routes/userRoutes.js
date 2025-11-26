import express from 'express';
import { getUser, loginUser, registerUser, deleteUser, updateUser } from '../controllers/userController.js';



const router = express.Router();



export default function userRoutes(pool, authMiddleware) {
  // POST login a user
  router.post('/login', loginUser);

  // POST register a user
  router.post('/register', registerUser);

  // GET specific user
  router.get('/profile/:user_id', authMiddleware, getUser)

  // UPDATE a user
  router.put('/profile/:user_id', authMiddleware, updateUser);

  // DELETE a user
  router.delete('/profile/:user_id', authMiddleware, deleteUser);

  return router;
}