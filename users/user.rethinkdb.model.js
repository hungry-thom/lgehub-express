const r = require('rethinkdb');

module.exports = {
  findUser,
  getById,
  getAll
};

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function findUser (username) {
  let connection, user;
  try {
    console.log('try find', username);
    connection = await r.connect(dbConfig);
    user = await r.table('Users').filter(r.row('username').eq(username)).run(connection);
    // user resturns cursor // console.log('in model', user);
  }
  catch (err) {
    console.log(err);
  }
  connection && connection.close()
  return user.next();
}

async function getAll () {
  let connection, users;
  try {
    console.log('try findAll');
    connection = await r.connect(dbConfig);
    users = await r.table('Users').without('hash').run(connection);
  }
  catch (err) {
    console.log(err);
  }
  connection && connection.close()
  return users.toArray();
}

async function getById (id) {
  let connection, user;
  try {
    connection = await r.connect(dbConfig);
    user = await r.table('Users').filter(r.row('id').eq(id)).run(connection);
  }
  catch (err) {
    console.log(err);
  }
  connection && connection.close()
  return user.next();
}
