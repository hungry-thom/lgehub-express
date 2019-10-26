const r = require('rethinkdb');

module.exports = {
  findUser,
  getById
};

const dbConfig = {
  host: 'localhost',
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
