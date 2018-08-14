// auth.js
var   jwt = require('jwt-simple'),
      cfg = require("../config/config-auth.js"),
   moment = require('moment'),
  Usuario = require('../model/Usuario');

module.exports = function(req, res, next) {
  console.log('check auth')
  var token = req.headers['x-access-token'];
  
  if(token){
    try {
      var decoded = jwt.decode(token, cfg.jwtSecret);

      if (decoded.exp <= Date.now()) {
        return res.status(401).json({error: 'Acesso Expirado, faça login novamente'});
      }
      
      Usuario.findById({_id:decoded.id}, function (err, user) {
        if(user){
          req.user = user;
          return next();
        }else{
          return res.status(401).json({message: "Usuarios não encontrado."})
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(401).json({message: 'Erro: Seu token é inválido'});
    }
  }else{
      return res.sendStatus(401);
  }
};