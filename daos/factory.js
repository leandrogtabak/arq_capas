const ProductosDAOMongoDB = require(`./products/ProductsDAOMongoDB`);
const CarritoDAOMongoDB = require(`./carts/CartDAOMongoDB`);
const OrdenesDAOMongoDB = require(`./orders/OrdersDAOMongoDB`);

const getStorage = () => {
  const storage = process.env.STORAGE;

  switch (storage) {
    case `MongoDB`:
      return {
        productos: new ProductosDAOMongoDB(),
        carrito: new CarritoDAOMongoDB(),
        ordenes: new OrdenesDAOMongoDB(),
      };
      break;

    default:
      return {
        productos: new ProductosDAOMongoDB(),
        carrito: new CarritoDAOMongoDB(),
        ordenes: new OrdenesDAOMongoDB(),
      };
      break;
  }
};

module.exports = getStorage;
