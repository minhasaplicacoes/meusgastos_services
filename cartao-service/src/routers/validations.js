module.exports = {
  user: {
    'user.email': { 
      in: 'body',
      notEmpty: true,
      isEmail: {
        errorMessage: 'Formato do E-mail eh invalido'
      },
      errorMessage: 'Valor de e-mail eh obrigatorio'

    },
    'user.password': {
      in: 'body',
      notEmpty: true,
      errorMessage: 'Valor de senha eh obrigatorio'
    },
    'user.name': {
      in: 'body',
      notEmpty: true,
      errorMessage: 'Valor de nome eh obrigatorio'
    }
  },
  userUpdate: {
    'id': {
      in: 'params',
      notEmpty: true,
      errorMessage: 'Parametro de identificação eh obrigatorio'
    },
    'user.name': {
      in: 'body',
      notEmpty: true,
      errorMessage: 'Valor de nome eh obrigatorio'
    },
    'user.password': {
      in: 'body',
      notEmpty: true,
      errorMessage: 'Valor de senha eh obrigatorio'
    }
  }
}
