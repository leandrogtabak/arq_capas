const mongoDB = require(`../../db/options/mongoDB`);

const carritoModel = require(`../../db/models/cart`);
const productsModel = require(`../../db/models/product`);
const userModel = require(`../../db/models/user`);

const CrudMongoDB = require(`../../db/containers/crudCart`);

class CarritoDAOMongoDB extends CrudMongoDB {
  constructor() {
    super(mongoDB, carritoModel, productsModel, userModel);
  }
}

module.exports = CarritoDAOMongoDB;
