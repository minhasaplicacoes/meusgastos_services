var express = require('../src/config/custom-express')();
var request = require('supertest')(express);
var should = require('chai').should();
var Usuario = require('../src/model/Usuario');

// ref. https://httpstatuses.com/

var senhaTeste = 'ramoura1234';

var usuarioLogin = {
    email: 'renatomoura@gmail.com',
    password: senhaTeste
};


var userJoao = new Usuario({
      email: 'joao@app.com.br',
      password: '123456',
      name: 'Joao do APP'
    });

var userAlterar = new Usuario({
      email: 'alterar@app.com.br',
      password: senhaTeste,
      name: 'Renato Moura',
      cpf: '00000000191',
      phone: '41999990000'
    });

var userSemEmail = {
      password: '123456',
      name: 'Renato Moura',
      cpf: '00000000191',
      phone: '41999990000'
    }

var userSemSenha = {
      email: 'usuario@app.com.br',
      //password: '123456',
      name: 'Renato Moura',
      cpf: '00000000191',
      phone: '41999990000'
    }
  

var userSemNome = {
      email: 'usuario@app.com.br',
      password: '123456',
      //name: 'Renato Moura',
      cpf: '00000000191',
      phone: '41999990000'
    }
    
var userCompleto = {
      email: 'usuarioCompletp@app.com.br',
      password: '123456',
      name: 'Renato Moura',
      cpf: '00000000191',
      phone: '41999990000'
    }

var userMinimo = {
      email: 'usuario@app.com.br',
      password: '123456',
      name: 'Renato Moura',
    }

describe('#Test repository Users - ',()=>{
    beforeEach(function(done){
      var query = Usuario.find().remove({ });
      Usuario.remove().exec().then((err,dados)=>{
        done();
      });
    });
  describe('QUANDO tentar cadastrar um usuario', function(){
    describe('E deixar de informar campos obrigatorios', function(){
      it('Deve retornar status code 401 e informando E-mail deve ser obrigatorio', function(done){
        autentica(usuarioLogin, (token) => {
          var user = userSemEmail;
          request.post('/v1/users')
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              should.exist(res.body.message);
              res.body.message.should.have.deep.property('[0].msg').that.contain('mail');
              done();
            });
        });
      });
      it('Deve retornar status code 401 e informando Nome deve ser obrigatorio', function(done){
        autentica(usuarioLogin, (token) => {
          var user = userSemNome;
          request.post('/v1/users')
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              should.exist(res.body.message);
              res.body.message.should.have.deep.property('[0].msg').that.contain('nome');
              done();
            });
        });
      });
      it('Deve retornar status code 401 e informando Senha deve ser obrigatorio', function(done){
        autentica(usuarioLogin, (token) => {
          var user = userSemSenha;
          request.post('/v1/users')
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              should.exist(res.body.message);
              res.body.message.should.have.deep.property('[0].msg').that.contain('senha');
              done();
            });
        });
      });
      it('Deve retornar status code 201 e permitir o cadastro para dados minimos', function(done){
        autentica(usuarioLogin, (token) => {
          var user = userMinimo;
          request.post('/v1/users')
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(201);
              
              Usuario.findOne({email: user.email},  function (err, user) {
                should.not.exist(err);
                should.exist(user);
                user.state.should.be.equal('A');
                done();
              });
              
            });
        });
      });
      it('Deve retornar status code 201 e permitir o cadastro para cadatro completo', function(done){
        autentica(usuarioLogin, (token) => {
          var user = userCompleto;
          request.post('/v1/users')
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(201);
              Usuario.findOne({email: user.email},  function (err, user) {
                should.not.exist(err);
                should.exist(user);
                user.state.should.be.equal('A');
                done();
              });
            });
        });
      });
    });
  });
  
  describe('QUANDO tentar alterar os dados de usuario', function(){
    it('NÃO deve permitir alterar o email', function(done){
      
      var userReq = new Usuario({
            email: 'alterar@app.com.br',
            password: senhaTeste,
            name: 'Renato Moura',
            cpf: '00000000191',
            phone: '41999990000'
          });
  
      userReq.save(err=>{
        if(err) console.log('erro ao tentar incluir ususairo 4 '+err);
  
        autentica({email: userReq.email,password: senhaTeste}, (token) => {
          var user = userReq;
          user.email = 'novoemail@app.com.br';
          
          request.put(`/v1/users/${userReq._id}`)
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              should.exist(res.body.mensagem);
              res.body.mensagem.should.be.contain('Não é permitido alterar o email');
              done();
            });
        });
      });
    });
    it('NÃO deve permitir enviar nome em branco', function(done){
  
      var userReq = new Usuario({
            email: 'alterar@app.com.br',
            password: senhaTeste,
            name: 'Renato Moura',
            cpf: '00000000191',
            phone: '41999990000'
          });
  
      userReq.save(err=>{
        if(err) console.log('erro ao tentar incluir ususairo 5 '+err);
  
        autentica({email: userReq.email,password: senhaTeste}, (token) => {
          var user = userReq;
          user.name = '';
          
          request.put(`/v1/users/${userReq._id}`)
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              res.body.message.should.have.deep.property('[0].msg').that.contain('nome');
              done();
            });
        });
      });
    });
    it('NÃO deve permitir enviar senha em branco', function(done){
  
      var userReq = new Usuario({
            email: 'alterar@app.com.br',
            password: senhaTeste,
            name: 'Renato Moura',
            cpf: '00000000191',
            phone: '41999990000'
          });
  
      userReq.save(err=>{
        if(err) console.log('erro ao tentar incluir ususairo 1 '+err);
  
        autentica({email: userReq.email,password: senhaTeste}, (token) => {
          var user = userReq;
          user.password = '';
          
          request.put(`/v1/users/${userReq._id}`)
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(400);
              res.body.message.should.have.deep.property('[0].msg').that.contain('senha');
              done();
            });
        });
      });
    });
    it('DEVE permitir enviar telefone em branco', function(done){
      var userReq = new Usuario({
            email: 'alterar2@app.com.br',
            password: senhaTeste,
            name: 'Renato Moura',
            cpf: '00000000191',
            phone: '41999990000'
          });
      
      userReq.save(err=>{
        if(err) console.log('erro ao tentar incluir ususairo 2 '+err);
  
        autentica({email: userReq.email,password: senhaTeste}, (token) => {
          var user = userReq;
          user.phone = '';
          
          request.put(`/v1/users/${userReq._id}`)
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(200);
              should.not.exist(res.body.mensagem);
              
  
              Usuario.findOne({email: user.email},  function (err, user) {
                should.not.exist(err);
                should.exist(user);
                user.phone.should.be.equal('');
                done();
              });
            });
        });
      });
    });
  });
  
  
  describe('QUANDO tentar excluir o usuario', function(){
    describe('E informar o id deferente do usuario logado', () => {
      it('DEVE marcar usuario com excluido, mas não deve apagar o registro', function(done){
        autentica(usuarioLogin, (token) => {
          userJoao.save(err => {
            should.not.exist(err);
            request.delete(`/v1/users/${userJoao._id}`)
              .set('x-access-token',token)
              .end(function (err, res) {
                should.not.exist(err);
                res.status.should.be.equal(400);
                res.body.mensagem.should.be.contain('permitido alterar usuario');
                done();
              });
          });
        });
      }); 
    });
    
    describe('E informar o mesmo id do usuario logado', () => {
      it('DEVE marcar usuario com excluido, mas não deve apagar o registro', function(done){
        var userOk = new Usuario({
          email: usuarioLogin.email,
          password: usuarioLogin.password,
          name: 'Usuario para alteração',
        });
        
        
        userOk.save(err=>{
          if(err) console.log(err);
          autentica(usuarioLogin, (token) => {
            request.delete(`/v1/users/${userOk._id}`)
              .set('x-access-token',token)
              .end(function (err, res) {
                should.not.exist(err);
                res.status.should.be.equal(200);
                
                Usuario.findOne({email: 'renatomoura@gmail.com'},  function (err, userxx) {
                  should.not.exist(err);
                  userxx.state.should.be.equal('R');
                  done();
                });
              });
          });
        });
      });
    });
  });

  
  describe('QUANDO tentar recuperar um usuario', function(){
    //describe('E deixar de informar campos obrigatorios', function(){
    it('Deve retornar apenas o usuario logado', function(done){
      var userReq = new Usuario({
            email: 'getDados@app.com.br',
            password: 'ramoura1234',
            name: 'Renato Moura',
            cpf: '00000000191',
            phone: '41999990000'
          });
      
      userReq.save(err=>{
        if(err) console.log('erro ao tentar incluir ususairo 2 '+err);
  
        autentica({email: userReq.email,password: senhaTeste}, (token) => {
          var user = userReq;
          request.get(`/v1/users`)
            .set('x-access-token',token)
            .send({user, debug: false})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.be.equal(200);
              should.not.exist(res.body.mensagem);
              

              should.exist(res.body.user);
              
              user = res.body.user
              
              user.name.should.be.equal('Renato Moura');
              user.email.should.be.equal('getDados@app.com.br');
              user.cpf.should.be.equal('00000000191');
              user.phone.should.be.equal('41999990000');
              done();
            });
        });
      });
    });
  });
});

function autentica(user, next){
  var userLogin = new Usuario({
      email: user.email,
      password: user.password,
      name: 'Usuario de login',
    });
    
    
  userLogin.save(err=>{
    
    request.post('/v1/login')
      .send({
              email: user.email,
              password: user.password,
              debug: false
        
      })
      .end(function (err, res) {
        if(err) console.log(err);
        if(res.status !== 200 ) console.log('Erro no LOGIN..'+JSON.stringify(res.body));
        var token = res.body.token;
        next(token);
      });
  });
}
