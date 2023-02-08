const passport = require('passport');
const UserModel = require(`../db/models/user`);
const log4js = require('../utils/logs');
const LocalStrategy = require('passport-local').Strategy;
const { isValidPassword } = require('../utils/utils');
const loggerArchiveError = log4js.getLogger(`errorArchive`);
const sendEmail = require(`../utils/nodemailer.js`);
const dotenv = require(`dotenv`);
dotenv.config();
const { createHash } = require('../utils/utils');

const deserializeUser = () => {
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      loggerArchiveError.error(err);
      done(err);
    }
  });
};

const serializeUser = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
};

const login = () => {
  passport.use(
    'login',
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await UserModel.findOne({ username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user.password, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          loggerArchiveError.error(err);
          done(err);
        }
      }
    )
  );
};

const signup = () => {
  passport.use(
    'signup',
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await UserModel.findOne({ username });
          if (user) {
            return done(null, false);
          }

          const newUser = new UserModel();
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.body.email;
          newUser.telefono = req.body.tel;
          newUser.edad = req.body.edad;
          newUser.direccion = req.body.direccion;
          newUser.foto = req.file.filename;
          newUser.carrito = [];
          newUser.admin = false; //cambiar a true para poder ingresar productos nuevos

          //Para cuando se registra un nuevo usuario
          const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Nuevo registro`,
            html: `
                      <h3>Nuevo registro de usuario!</h3>
                      <p> Datos:</p>
                      <ul>
                      <li> Nombre: ${newUser.username}</li>
                      <li> Email: ${newUser.email}</li>
                      <li> Teléfono: ${newUser.telefono}</li>
                      <li> Edad: ${newUser.edad}</li>
                      <li> Direccion: ${newUser.direccion}</li>
                      </ul>
                  `,
          };

          const userSave = await newUser.save();

          const email = await sendEmail(mailOptions);

          return done(null, userSave);
        } catch (err) {
          loggerArchiveError.error(err);
          done(err);
        }
      }
    )
  );
};
module.exports = {
  signup,
  login,
  serializeUser,
  deserializeUser,
};
