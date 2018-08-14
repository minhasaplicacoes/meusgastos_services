var   jwt = require("jwt-simple"),
    users = require("../model/users.js"),
      cfg = require("../config/config-auth.js"),
  moment = require('moment'),
 Usuario = require('../model/Usuario');

module.exports = {
  configure: function(router){
    router.route('/login')
      .post(getToken);
      
  }
}

var getToken = function(req, res) {
    if (req.body.email && req.body.password) {
      var email    = req.body.email    || '';
      var password = req.body.password || '';
      var expTime  = req.body.expTime  || {period: 'd', number: 7};
      
      if (email == '' || password == '') {
        return res.send(401);
      }
      
      Usuario.findOne({email: email}, function (err, user) {
        if (err) {
          return res.status(401).json({mensagem:'dados invalidos', erro: err});
        }
      

        if (user) {
          user.verificaSenha(password, function(isMatch) {
            if (!isMatch) {
              return res.status(401).json({mensagem:'dados invalidos', erro: 'Senha não confere'});
            }
  
            var expires = moment().add(expTime.number,expTime.period).valueOf();
            var payload = {
              id: user.id,
              exp: expires
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.cookie('acess_token_sso', token, { domain: '.c9users.io', secure: true })
            
            res.json({token: token, version: '1.21'});
          });
        } else {
           res.status(401).json({mensagem:'dados invalidos', erro:'Usuairo não localizado '+email});
        }
      });      
  }else{
    res.sendStatus(400);
  }
};