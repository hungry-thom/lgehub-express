const bcrypt = require('../node_modules/bcryptjs');
const r = require('../node_modules/rethinkdb');

const dbConfig = {
  host: '192.168.100.102',
  port: 28015,
  db: 'test'
}

async function touchUser(user) {
  let connection, response;
  try {
    connection = await r.connect(dbConfig);
    response = await r.table('Users').insert(user).run(connection);
  }
  catch (err) {
    console.alert(err)
  }
  connection && connection.close()
  return response
}

async function main () {
  const user = {
    username: 'Thom',
    role: 'Admin',
  }
  const hash = bcrypt.hashSync('feedme', 10);
  user['hash'] = hash;
  const resp = await touchUser(user);
  console.log('created', resp);
}

main();
