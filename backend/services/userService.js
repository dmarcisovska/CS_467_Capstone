import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';


export const loginUserService = async (email, password, req) => {
  const user = await userRepository.getUserByEmail(email);

  if (!user) {
    const error = new Error('wrong email/password');
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    const error = new Error('invalid password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {user_id: user.user_id, email: user.email}, 
    // eslint-disable-next-line
    process.env.JWT_SECRET_KEY,
    {expiresIn: '7d'}
  )

  // Normalize avatar_url for response
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const normalizedAvatarUrl =
    user.avatar_url && !String(user.avatar_url).startsWith('undefined')
      ? user.avatar_url
      : `${baseUrl}/api/profile-picture/${user.user_id}`;

  return {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      avatar_url: normalizedAvatarUrl
    }
  }
}

export const registerUserService = async (email, password, username) => {
  const existingUser = await userRepository.getUserByEmail(email);

  if (existingUser) {
    const error = new Error('email or username already exists');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser(email, hashedPassword, username);

  return newUser;
}

export const getUserService = async (userId, req) => {
  const user = await userRepository.getUserById(userId);

  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const normalizedAvatarUrl =
    user.avatar_url && !String(user.avatar_url).startsWith('undefined')
      ? user.avatar_url
      : `${baseUrl}/api/profile-picture/${user.user_id}`;

  return {
    ...user,
    avatar_url: normalizedAvatarUrl
  }
}

export const updateUserService = async (userId, updateData) => {
  const { username, avatar_url, password } = updateData;

  const existingUser = await userRepository.getUserById(userId);

  if (!existingUser) {
    const error = new Error('user not found');
    error.status = 404;
    throw error;
  }

  let newHashedPassword = null;
  if (password) {
    newHashedPassword = await bcrypt.hash(password, 10);

  }

  const updatedUser = await userRepository.updateUserById(userId, {
    username, 
    avatar_url,
    password_hash: newHashedPassword
  })

  return updatedUser;
}

export const deleteUserService = async (userId) => {
  const existingUser = await userRepository.getUserById(userId);

  if (!existingUser) {
    console.log('user does not exist');
    return null;
  }

  const deletedUser = await userRepository.deleteUserById(userId);

  return deletedUser;
}
