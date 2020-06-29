import * as Yup from 'yup';

import Product from '../models/Product';

class ProductController {
  async index(req, res) {
    const products = await Product.findAll();

    return res.json(products);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
      image: Yup.string().required(),
    });

    const { title, price, image } = req.body;

    if (
      !(await schema.isValid({
        title,
        price,
        image,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const product = await Product.create({
      title,
      price,
      image,
    });

    return res.json(product);
  }

  async update(req, res) {
    const { id, title, price, image } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json('Product does not exists.');
    }

    await product.update({ title, price, image });

    return res.json({ title, price, image });
  }
}

export default new ProductController();
