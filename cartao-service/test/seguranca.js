var express = require('../src/config/custom-express')();
var request = require('supertest')(express);
var expect = require('chai').expect;

// ref. https://httpstatuses.com/

describe('#Test Security - ',()=>{

  describe('QUANDO tentar acessar as rotas sem token(sem autenticação)', function(){
  
    it('Deve retornar status code 401 para rota DELETE/v1/users', function(done){
        request.delete('/v1/users/1')
          .send()
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(401);
            done();
          });
      });
      it('Deve retornar status code 404 para rota GET/v1/users', function(done){
        request.get('/v1/users')
          .send()
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(401);
            done();
          });
      });
      it('Deve retornar status code 401 para rota PUT/v1/users', function(done){
        request.put('/v1/users/1')
          .send()
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(401);
            done();
          });
    });
  });
});