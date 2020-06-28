import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      fisrt_name: Yup.string().required(),
      last_name: Yup.string().required(),
      document: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      phone: Yup.string().required(),
    });

    const {
      first_name,
      last_name,
      document,
      email,
      password,
      phone,
    } = req.body;

    if (
      !(await schema.isValid({
        first_name,
        last_name,
        document,
        email,
        password,
        phone,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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
    const schema = Yup.object().shape({
      fisrt_name: Yup.string(),
      last_name: Yup.string(),
      document: Yup.string(),
      email: Yup.string().email(),
      phone: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    const {
      first_name,
      last_name,
      document,
      email,
      phone,
      oldPassword,
      password,
      confirmPassword,
    } = req.body;

    if (
      !(await schema.isValid({
        first_name,
        last_name,
        document,
        email,
        phone,
        oldPassword,
        password,
        confirmPassword,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

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
      password,
      confirmPassword,
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
