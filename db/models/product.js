const { Schema, model } = require(`mongoose`);

const productoSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  code: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  cantidad: { type: Number },
});

module.exports = model(`Productos`, productoSchema);
