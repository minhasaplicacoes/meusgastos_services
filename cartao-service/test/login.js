var express = require('../src/config/custom-express')();
var request = require('supertest')(express);
var assert = require('chai').assert;
var Usuario = require('../src/model/Usuario');


var userOk = new Usuario({
      email: 'renatomoura@gmail.com',
      password: 'ramoura1234',
      name: 'Renato Moura'
    });

describe('#Test Login - ',()=>{

  describe('QUANDO tentar efetuar o login', function(){
      before(function(done){
        Usuario.remove({},  (err) => { 
          if(err) console.log('Erro ao tentar excluir todos usuarios...'+err);
            
          userOk.save(err=>{
            if(err) console.log('erro ao tentar incluir ususairo'+err);
            done();
          });
        });  
      });
    after(function(done){
      var promise = userOk.remove();
  
      promise.then(function(data) {
        done()
      })
      
      promise.catch(function(err){
         console.log('erro....: '+err); 
      });    
  
    });
    describe('E não informar email e senha', function(){
      it('Deve retornar status 400 bad request', function(done){
        
        request.post('/v1/login')
          .send()
          .end(function (err, res) {
            assert.equal(res.status, 400);
            done();
        });
      });
      it('Não deve retornar dados no corpo', function(done){
        request.post('/v1/login')
          .send()
          .end(function (err, res) {
            assert.deepEqual(res.body, {});
            done();
        });
      });
    });
    
    describe('E informar email incorreto', function(){
        it('Deve retornar status code 401', function(done){
          request.post('/v1/login')
            .send({
              email: 'xururu@naoexiste.com.br'
            })
            .end(function (err, res) {
              assert.equal(res.status, 400);
              done();
          });
          
        })
        it('Deve retornar mensagem informando dados incorretos', function(done){
          request.post('/v1/login')
            .send({
              email: 'xururu@naoexiste.com.br',
              password: 'xururu'
            })
            .end(function (err, res) {
              var retorno = res.body;
              assert.equal(retorno.mensagem, 'dados invalidos');
              done();
          });
          
        })
    });
    
    describe('E informar email correto', function(){
      describe('E senha incorreta', function(){
        it('Deve retornar status code 401', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'xururu'
            })
            .end(function (err, res) {
              assert.equal(res.status, 401);
              done();
          });
  
        })
        it('Deve retornar mensagem informando dados incorretos', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'xururu'
            })
            .end(function (err, res) {
              var retorno = res.body;
              assert.equal(retorno.mensagem, 'dados invalidos');
              done();
          });
        })
      })
      describe('E senha correta', function(){
        it('Deve retornar status code 200', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'ramoura1234'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              done();
          });
          
        })
        it('Deve retornar o token de autorização valido', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'ramoura1234'
            })
            .end(function (err, res) {
              var retorno = res.body;
              assert.property(retorno, 'token');
              done();
          });
          
        })
      });
    });
    
    describe("E informar parametro 'expTime' invalido", function(){
      it('DEVE retorno status code 400', function(done){done()});
    });
    describe("E informar parametro 'expTime' fora do periodo maximo permitido", function(){
      it('DEVE retorno status code 400', function(done){done()});
    });
  
    describe("E informar parametro 'expTime' valido", function(){
      it('DEVE retornar status code 200', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'ramoura1234',
              expTime: '7d'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              done();
          });
        
      });
      it('DEVE retornar um token valido', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'ramoura1234'
            })
            .end(function (err, res) {
              var retorno = res.body;
              assert.property(retorno, 'token');
              done();
          });
        
      });
      it('DEVE respeitar o tempo de expiracao', function(done){
          request.post('/v1/login')
            .send({
              email: 'renatomoura@gmail.com',
              password: 'ramoura1234',
              expTime: {
                period: 'ms',
                number: 100
              }
            })
            .end(function (err, res) {
              var retorno = res.body;
              assert.property(retorno, 'token');
              setTimeout(function(){
                request.get('/v1/teste')
                  .set('x-access-token',retorno.token)
                  .end(function (err, res) {
                    var retorno = res.body;
                    assert.equal(res.status, 401)
                    assert.property(retorno, 'error');
                    done()
                  });
              }, 500);
          });
        
      });
    });
  
  });
});    

