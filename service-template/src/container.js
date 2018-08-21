const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const Application = require('./application/Application');
const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');

const logger = require('./infrastructure/logging/logger');

const config = require('./infrastructure/config');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const UserSerializer = require('./interfaces/http/user/UserSerializer');

const UsersRepository = require('./infrastructure/user/UsersRepository');


const {
  GetAllUsers,
} = require('./application/user');


const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),

  });


// Repositories
container.register({
  usersRepository: asClass(UsersRepository).singleton()
});

// Operations
container.register({
  getAllUsers: asClass(GetAllUsers)
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer)
});

module.exports = container;