var mongoose = require('mongoose')


module.exports = {
  connect: function(){
    
    if(mongoose.connection.readyState > 0){
      return; 
    }
    
    var db = "";
    
    var options = { };

    if(!process.env.NODE_ENV){
      db = 'mongodb://localhost/test_database';
      options.server = { poolSize: 1 }
      //console.log(options);
    }else if(process.env.NODE_ENV == "desenv"){
      db = 'mongodb://localhost/test_database';
      options.server = { poolSize: 1 }
    }else if(process.env.NODE_ENV == "travis-ci"){
      db = 'mongodb://localhost/ci_database';
      options.server = { poolSize: 1 }
    }else if(process.env.NODE_ENV == "production"){
      //console.log('URI: '+process.env.MONGODB_URI);
      db = process.env.MONGODB_URI;
      options.server = { poolSize: 5 }
    }
    mongoose.Promise = require('bluebird');
    var mongo = mongoose.connect(db, options);

    mongoose.connection.on('connected', function () {  
      console.log('>> Mongoose default connection open to ' + db);
    });
    
    mongoose.connection.on('error',function (err) {  
      console.log('>> Mongoose default connection error: ' + err);
    });
    
    mongoose.connection.on('disconnected', function () {  
      console.log('>> Mongoose default connection disconnected');
    });
    
    mongoose.connection.on('open', function () {  
      console.log('Mongoose default connection is open');
    });

    // fecha as conection quando o server node para.
    process.on('SIGINT', function() {  
      mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });    
  }
}
