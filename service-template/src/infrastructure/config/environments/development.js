const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');

module.exports = {
  web: {
    port: 3000
  },
  logging: {
    "appenders": {
      "access": {
        "type": 'file',
        "filename": "log/app.log",
        "maxLogSize": 10485760,
        "numBackups": 3
      },
      "app": {
        "type": 'file',
        "filename": "log/app.log",
        "maxLogSize": 10485760,
        "numBackups": 3
      },
      "console": {
        "type": 'console'
      }
      
    },
    
    "categories": {
      "default": { "appenders": [ "app", "console"], "level": "DEBUG" },
      "http": { "appenders": [ "access" ], "level": "DEBUG" }
    }
  }
};
