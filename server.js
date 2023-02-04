import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { ContenedorArchivo } from './contenedores/ContenedorArchivo.js';
import { conectarDB } from './controllersdb.js';
import handlebars from 'express-handlebars';
import session from 'express-session';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { passportMiddleware } from './middlewares/passport.js';

require('dotenv').config();
import router from './routes/router.js';
const yargs = require('yargs/yargs')(process.argv.slice(2));
const args = yargs.argv._;

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static(path.resolve(__dirname, './views')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'Is this the real life? Is this just fantasy?',
    cookie: {
      httpOnly: false,
      secure: false,
      expires: 60000,
      maxAge: parseInt(process.env.TIEMPO_EXPIRACION),
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passportMiddleware.initialize());
app.use(passportMiddleware.session());

const PORT = parseInt(args[0]) || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const miContenedorMensajes = new ContenedorArchivo('./mensajes.json');
const miContenedorProductos = new ContenedorArchivo('./productos.json');

// ------------------------------------------------------------------------------
//  HANDLEBARS
// ------------------------------------------------------------------------------

app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: './views/layouts/',
    partialsDir: './views/partials/',
  })
);

// establecemos el motor de plantilla que se utiliza
app.set('view engine', 'hbs');
// establecemos directorio donde se encuentran los archivos de plantilla
app.set('views', './views');

// ------------------------------------------------------------------------------
//  ROUTER
// ------------------------------------------------------------------------------
app.use('/', router);

// ------------------------------------------------------------------------------
//  SOCKET
// ------------------------------------------------------------------------------

io.on('connection', async (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('onload', async () => {
    const productos = await miContenedorProductos.getAll();
    const mensajes = await miContenedorMensajes.getAll();
    io.sockets.emit('productos', productos);
    io.sockets.emit('mensajes', mensajes);
  });

  socket.on('new-message', async (newMessage) => {
    await miContenedorMensajes.save(newMessage);
    const mensajes = await miContenedorMensajes.getAll();
    io.sockets.emit('mensajes', mensajes);
  });
  socket.on('new-product', async (newProduct) => {
    await miContenedorProductos.save(newProduct);
    const productos = await miContenedorProductos.getAll();
    io.sockets.emit('productos', productos);
  });
});

// ------------------------------------------------------------------------------
//  LISTEN SERVER
// ------------------------------------------------------------------------------

conectarDB(process.env.URL_BASE_DE_DATOS, (err) => {
  if (err) return console.log('error en conexión de base de datos', err);
  console.log('BASE DE DATOS CONECTADA');

  httpServer.listen(PORT, function () {
    console.log(`Servidor corriendo en ${PORT}`);
  });
});

httpServer.on('error', (error) => console.log(`Error en el servidor: ${error}`));
