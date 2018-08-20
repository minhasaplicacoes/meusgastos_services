const { Router } = require('express');
const Status = require('http-status');

const { makeInvoker } = require('awilix-express')


function makeAPI({ getAllUsers, userSerializer }) {
  return {
     listAll(req, res, next) {
        console.log("Chegou aqui....",getAllUsers,userSerializer)
        const { SUCCESS, ERROR } = getAllUsers.outputs;
    
        getAllUsers
          .on(SUCCESS, (users) => {
            res
              .status(Status.OK)
              .json(users.map(userSerializer.serialize));
          })
          .on(ERROR, next);
    
        getAllUsers.execute();
      },
  }
}


const UsersController = {
  get router() {

  const api = makeInvoker(makeAPI)
  
  const router = Router();
  router.get('/', api('listAll'))    

  return router;

  },
};

module.exports = UsersController;
