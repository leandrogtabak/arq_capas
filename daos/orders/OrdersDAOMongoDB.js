const mongoDB = require(`../../db/options/mongoDB`);
const productsModel = require(`../../db/models/product`);
const userModel = require(`../../db/models/user`);
const ordenModel = require(`../../db/models/orders`);

const CrudMongoDB = require(`../../db/containers/crudOrders`);

class OrdenesDAOMongoDB extends CrudMongoDB {
  constructor() {
    super(mongoDB, productsModel, userModel, ordenModel);
  }
}

module.exports = OrdenesDAOMongoDB;
