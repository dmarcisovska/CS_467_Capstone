import { deleteUserService, getUserService, loginUserService, registerUserService, updateUserService } from "../services/userService.js";



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({error: 'email/password required'});
    }

    const loginRes = await loginUserService(email, password, req);

    res.json({
      message: 'login successful',
      token: loginRes.token,
      user: loginRes.user
    })
  } catch (error) {
    console.error(error);

    if (error.status === 401) {
      return res.status(400).json({Error: error.message});
    }

    res.status(500).json({error: 'database error'});
  }
}

export const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({error: 'one or more inputs were empty'});
    }

    if (password.length < 8) {
      return res.status(400).json({error: 'password too short. (8 or more)'})
    }

    const user = await registerUserService(email, password, username);

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
    })

  } catch (error) {
    console.error(error);

    if (error.status === 400) {
      return res.status(400).json({Error: error.message})
    }

    // handle database errors
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') {
        return res.status(400).json({ Error: 'email already exists' });
      }
      if (error.constraint === 'users_username_key') {
        return res.status(400).json({ Error: 'username already exists' });
      }
    }

    res.status(500).json({error: 'server error'});
  }
};

export const getUser = async (req, res) => {
  try {
    const {user_id} = req.params;

    const user = await getUserService(user_id, req);

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'server error'});
  }
}

export const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, avatar_url, password } = req.body;

    if (req.user.user_id !== user_id) {
      return res.status(403).json({ error: 'cannot delete, wrong account' });
    }

    const updatedUser = await updateUserService(user_id, {
      username, 
      avatar_url,
      password
    });

    res.json({
      message: 'user updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({error: 'server error'});
  }
}

export const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  if (req.user.user_id !== user_id) {
    return res.status(403).json({error: 'cannot edit, wrong account'});

  }

  const deletedUser = await deleteUserService(user_id);

  if (!deletedUser) {
    return res.status(404).json({error: 'user not found'});
  }

  res.json({
    message: 'user deleted successfully',
    user: deletedUser
  })
}
