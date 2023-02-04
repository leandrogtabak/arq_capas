import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

let baseDeDatosConectada = false;

export function conectarDB(url, cb) {
  mongoose.connect(
    url,
    {
      serverSelectionTimeoutMS: 3000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
      auth: {
        username: process.env.USER,
        password: process.env.PASS,
      },
    },
    (err) => {
      if (!err) {
        baseDeDatosConectada = true;
      }
      if (cb != null) {
        cb(err);
      }
    }
  );
}
