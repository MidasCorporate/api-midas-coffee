import * as Yup from 'yup';

import Quantity from '../models/Quantity';

class QuantityController {
  async index(req, res) {
    const quantities = await Quantity.findAll();

    return res.json(quantities);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string().required(),
    });

    const { product_id, token } = req.body;

    if (
      !(await schema.isValid({
        token,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const quantity = await Quantity.create({
      product_id,
      token,
    });

    return res.json(quantity);
  }

  async update(req, res) {
    const { id, product_id, token, status } = req.body;

    const quantity = await Quantity.findByPk(id);

    if (!quantity) {
      return res.status(400).json('Quantity does not exists.');
    }

    await quantity.update({ token, status });

    return res.json(quantity);
  }
}

export default new QuantityController();
