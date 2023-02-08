const { Router } = require(`express`);
const { login, signup, serializeUser, deserializeUser } = require('../authentication/authPassport.js');
const passport = require('passport');

const { signupFormController, loginFormController, logoutController, profileController } = require(`../controller/userController`);

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/profileImg');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

login();
signup();
serializeUser();
deserializeUser();

const loginRouter = Router();
const signupRouter = Router();
const logoutRouter = Router();
const profileRouter = Router();

loginRouter.get(`/`, loginFormController);
loginRouter.post(
  '/',
  passport.authenticate('login', {
    //indicamos el controlador de passport, llega desde el formulario de login.
    successRedirect: '/bienvenida', //redirect es con método get, vamos a home.
    failureRedirect: `/error/Error al iniciar sesión usuario contraseña incorrecta`, // redirect es con método get, vamos a /login de get.
    failureFlash: true, // nos permite enviar mensajes.
  })
);

signupRouter.get(`/`, signupFormController);
signupRouter.post(
  '/',
  upload.single('profilePic'),
  passport.authenticate('signup', {
    //indicamos el controlador de passport, llega desde el formulario de signup.
    successRedirect: '/', // redirect es con método get, vamos a home.
    failureRedirect: `/error/Error al crear la cuenta ingrese otro usuario`, // redirect es con método get, vamos a /signup de signup.
    failureFlash: true, // nos permite enviar mensajes.
  })
);

profileRouter.get(`/`, profileController);

logoutRouter.get(`/`, logoutController);

module.exports = {
  signupRouter,
  loginRouter,
  logoutRouter,
  profileRouter,
};
