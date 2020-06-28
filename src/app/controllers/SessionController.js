import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, first_name, last_name } = user;

    const { secret, expiresIn } = authConfig;

    return res.json({
      user: { id, first_name, last_name },
      token: jwt.sign({ id }, secret, {
        expiresIn,
      }),
    });
  }
}

export default new SessionController();
