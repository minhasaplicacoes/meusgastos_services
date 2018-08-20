const express = require('express');

class Server {
  constructor( { router, logger } ) {
    this.logger = logger;
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(router);

  }

  start() {
    return new Promise((resolve) => {
      const http = this.express
        .listen(process.env.PORT, () => {
          const { port } = http.address();
          console.log(`[p ${process.pid}] Listening at port ${port}`);
          this.logger.debug(`[p ${process.pid}] Listening at port ${port}`);
          resolve();
        });
    });
  }
}

module.exports = Server;
