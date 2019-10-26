const { secret } = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');
const bcrypt = require('bcryptjs');
const Umodel = require('./user.rethinkdb.model.js');

module.exports = {
  authenticate,
  getById,
  getAll
};

async function authenticate ({username, password }) {
  // this will be call to database, password should be received as hash from front end client?
  console.log('uname', username);
  const user = await Umodel.findUser(username);
  console.log('inService', user);
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id, role: user.role }, secret);
    const { hash, ...userWithoutHash } = user;
    return {
      ...userWithoutHash,
      token
    };
  }
}

async function getAll () {
  const users = await Umodel.getAll(); // receives as array, no hash
  return users;
}

async function getById (id) {
  const user = await Umodel.getById(id);
  if (!user) return;
  const { hash, ...userWithoutHash } = user;
  return  userWithoutHash;
}

