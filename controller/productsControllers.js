const storage = require(`../daos/factory`);

const productsStorage = storage().productos;

module.exports = {
    productsStorage 
}