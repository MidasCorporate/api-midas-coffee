import Sequelize, { Model } from 'sequelize';

class Quantity extends Model {
  static init(sequelize) {
    super.init(
      {
        token: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default Quantity;
