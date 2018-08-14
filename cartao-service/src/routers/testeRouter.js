var restrict = require('../controllers/auth')

module.exports = {
  configure: function(router){
    router.route('/teste')
      .get(restrict, teste);

   }
}   
var teste = function(req, resp){ 
      var ctr = require('../controllers/testeCtrl');
      
      ctr.teste(function(dados) {
         resp.status(200).json(dados);
      });
   }


