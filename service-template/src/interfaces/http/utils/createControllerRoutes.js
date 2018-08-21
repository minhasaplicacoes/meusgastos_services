const path = require('path');


//TODO mudara para injection
module.exports = function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve('src/interfaces/http', controllerUri);
  const Controller = require(controllerPath);

  return Controller.router;
};
