var expressValidator = require('express-validator'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan');
          

var rotasLogin = require('../routers/loginRouter'),
    rotasTeste = require('../routers/testeRouter'),
    userRouter = require('../routers/userRouter'),
    redirectRouter = require('../routers/redirectRouter'),
            db = require('../persistence/connectionFactory'),
      restrict = require('../controllers/auth');

module.exports = function() {
  var app = express();
  
  db.connect();

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(function(req, res, next){
    if(req.body.debug){
      console.log(`${req.headers.host} - ${req.method} ${req.url} (${JSON.stringify(req.body)})`);
    }
    next();
  })

  /* Basic CORS */
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
  var router = express.Router();
  app.use('/v1', router);


  rotasLogin.configure(router);
  redirectRouter.configure(router);
  userRouter.configure(router,restrict);
  rotasTeste.configure(router);
  
  

  return app;
};
