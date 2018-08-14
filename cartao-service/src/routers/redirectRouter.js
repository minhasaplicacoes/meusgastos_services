var restrict = require('../controllers/auth')

module.exports = {
  configure: function(router){
    router.route('/redirect')
      .get(teste);
   }
}   
var teste = function(req, resp){ 
    resp.setHeader('seila','tasabendo');
    resp.cookie('acess_token', 'tobi', { domain: '.c9users.io', secure: true })
    resp.redirect('http://www.google.com.br');
}


