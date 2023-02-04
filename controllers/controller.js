import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yargs = require('yargs/yargs')(process.argv.slice(2));
const args = yargs.argv._;
const { fork } = require('child_process');
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getInfo(req, res) {
  res.render('info', { args: args, process: process, memory: process.memoryUsage().rss, dir: process.cwd(), projDir: process.cwd().split('\\').at(-1) });
}

export function getRandoms(req, res) {
  const cant = req.query.cant ?? 1000000; //no pongo 100 millones por que tarda un montonazo
  const computo = fork(__dirname + '/randoms.js');
  computo.send(cant);
  computo.on('message', (resultado) => {
    res.send(resultado);
  });
}

export function getLogin(req, res) {
  if (req.isAuthenticated()) {
    var user = req.user;
    console.log('user logueado');
    res.render('main', {
      usuario: user.username,
    });
  } else {
    console.log('user NO logueado');
    res.render('login');
  }
}

export function postLogin(req, res) {
  var user = req.user;

  res.redirect('/login');
}

export function getSignup(req, res) {
  res.render('register');
}

export function postSignup(req, res) {
  var user = req.user;
  getLogin(req, res);
}

export function getFaillogin(req, res) {
  console.log('error en login');
  res.render('faillogin', {});
}

export function getFailsignup(req, res) {
  console.log('error en signup');
  res.render('failsignup', {});
}

export function getLogout(req, res) {
  var user = req.user;

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      res.render('logout', {
        usuario: user.username,
      });
    });
  });
}

export function failRoute(req, res) {
  res.status(404).send('Error en ruta');
}
