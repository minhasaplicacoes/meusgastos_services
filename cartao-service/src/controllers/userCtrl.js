var Usuario = require('../model/Usuario');

module.exports = {
  saveUser: function(user, call){
    var userGravar = new Usuario(user);
    userGravar.save(function(err){
      call(err);
    })
  
    
  },
  
  updateUser: function(data, call){
      var id = data.idUpdate;

      if(data.userLogged.id !== id){
          return call({mensagem:'Não é permitido alterar usuario diferente do usuario logado'});
      }
      

      Usuario.findById({_id: id}, function (err, user) {
        if (err) {
          return call({mensagem:'Usuario não encontrado'});
        }
    
        if(data.update.email !== user.email){
          return call({mensagem:'Não é permitido alterar o email'});
        }
    
        user.name     = data.update.name;
        user.password = data.update.password;
        user.phone = data.update.phone;
        user.cpf   = data.update.cpf;
    
        user.save(function(err, dados){
          call(err);
        })
      });

    
  },
  
  removeUser: function(data, call){
    var id =data.idUpdate;
  
    if(data.userLogged.id !== id){
        return call({mensagem:'Não é permitido alterar usuario diferente do usuario logado'});
    }
    Usuario.findById({_id: id}, function (err, user) {
      if (err) {
        return call({mensagem:'Usuario não encontrado'});
      }
      user.state = 'R';
      
      user.save(function(err, dados){
        if(err){
          return call({mensagem:'Erro ao tentar atualizar os dados do usuario.', erro:err});
        }
        call();
      })
    });

  }
  
};