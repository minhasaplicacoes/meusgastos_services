const User = require('src/domain/user/User');


class UsersRepository {
  constructor() {
  }

  async getAll(...args) {
    
    var list = [
      new User({id:1, name:"Renato",age:22}),
      new User({id:2, name:"Joao",age:18}),
      new User({id:3, name:"Mario",age:25})
      ]
    
    return list;
  }

}

module.exports = UsersRepository;
