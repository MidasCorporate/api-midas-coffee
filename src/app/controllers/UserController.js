import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async store(req, res) {
    const {
      first_name,
      last_name,
      document,
      email,
      password,
      phone,
    } = req.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    await User.create({
      first_name,
      last_name,
      document,
      email,
      password,
      phone,
    });

    return res.json({ first_name, last_name, email, phone });
  }

  async update(req, res) {
    const {
      first_name,
      last_name,
      document,
      email,
      oldPassword,
      phone,
    } = req.body;

    const user = await User.findByPk(req.userId);

    console.log(user);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { id } = await user.update({
      first_name,
      last_name,
      document,
      email,
      oldPassword,
      phone,
    });

    return res.json({
      id,
      first_name,
      last_name,
      email,
      phone,
    });
  }
}

export default new UserController();
