var userValidation = require('./validations'),
          userCtrl = require('../controllers/userCtrl');
  
module.exports = {
  configure: function(router, restrict){

    router.route('/users')
      .get(restrict, getUser)
      .post(postUser);
    router.route('/users/:id')
      .put(restrict, putUser)
      .delete(restrict, deleteUser);
  }
};

var getUser = function(req, res) {
  return res.status(200).json({user:req.user});
};

var postUser = function(req, res) {
  req.check(userValidation.user);
  var erros = req.validationErrors();
  if (erros) {
    res.status(400).send({message: erros});
    return;
  }
  var userReq = req.body.user;
  
  userCtrl.saveUser(userReq,err=>{
      if(err){
        return res.status(400).send({message: err});
      }
      res.sendStatus(201);
});
};
 
var putUser = function(req, res) {
  req.check(userValidation.userUpdate);
  
  var erros = req.validationErrors();
  if (erros) {
    res.status(400).send({message: erros});
    return;
  }

  userCtrl.updateUser({
    userLogged: req.user,
    update: req.body.user,
    idUpdate: req.params.id
    }, (err)=>{
      if(err){
        return res.status(400).json(err);
      }
      res.sendStatus(200);
  });
};

var deleteUser = function(req, res) {
  var data = {
    userLogged: req.user,
    update: req.body.user,
    idUpdate: req.params.id
  };
    
  userCtrl.removeUser(data,err=>{
    if(err){
      return res.status(400).json(err);
    }
    res.sendStatus(200);
  });
};