var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  state: {
    type: String,
    default:'A',
    required: false
  }

});

UsuarioSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UsuarioSchema.methods.verificaSenha = function(password, next) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return next(err);
    next(isMatch);
  });
};

UsuarioSchema.methods.makeRemoved = function(next) {
  console.log('altera usuario '+this);
  this.state = 'R'// Removed
  this.save(next);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
