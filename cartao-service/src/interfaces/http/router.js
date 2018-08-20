const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler }) => {
  const router = Router();


  /* istanbul ignore if */
  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware);

  apiRouter.use('/users', controller('user/UsersController'));

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
