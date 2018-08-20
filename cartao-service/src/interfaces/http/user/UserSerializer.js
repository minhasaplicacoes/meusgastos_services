const UserSerializer = {
  serialize({ id, name }) {
    console.log("Serialize")
    return {
      id,
      name
    };
  }
};

module.exports = UserSerializer;
