import jwt from 'jsonwebtoken';
import "dotenv/config";

export default function authenticateToken(pool) {
  return async (req, res, next) => {

    try {
      const token = req.headers.authorization;
      if (!token || !token.includes('Bearer')) {
        return res.status(401).send({message: 'no valid token'});
    
      }
      else {
        const userToken = token.replace('Bearer ', '');
        // eslint-disable-next-line no-undef
        const authorizedUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
        if (!authorizedUser) {
          return res.status(401).json({error: 'token from user does not exist'});
    
        }
        const isUserExists = await pool.query(`
          SELECT user_id FROM users WHERE user_id = $1 AND is_deleted = false
          `, [authorizedUser.user_id])
        if (isUserExists.rows.length === 0) {
          return res.status(401).json({error: 'user does not exist'});
        }

        req.user = authorizedUser;

        next();
      }
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).send('Unauthorized');
      }
    }
  }
}
