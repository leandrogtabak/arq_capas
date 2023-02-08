const mongoDB = require(`../../db/options/mongoDB`);
const productsModel = require(`../../db/models/product`);

const CrudMongoDB = require(`../../db/containers/crudProducts`);

class ProductosDAOMongoDB extends CrudMongoDB {
  constructor() {
    super(mongoDB, productsModel);
  }
}

module.exports = ProductosDAOMongoDB;
