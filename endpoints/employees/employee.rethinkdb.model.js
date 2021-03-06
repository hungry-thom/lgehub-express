const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  newEmployee,
  getEmployeeList
};

// const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'test'
}

async function newEmployee (details) {
  let connection, resp;
  try {
    console.log('+++newEmployee', details);
    connection = await r.connect(dbConfig);
    // todo: separate method for updating record
    resp = await r.table('Employees').insert(details, { conflict: 'replace' }).run(connection);
    // user resturns cursor // console.log('in model', user);
  }
  catch (err) {
    console.log('++++newEmployeeError', err);
  }
  connection && connection.close()
  
  return resp;
}

async function getEmployeeList () {
  let connection, employeeList;
  try {
    console.log('+++getEmpList');
    connection = await r.connect(dbConfig);
    employeeList = await r.table('Employees').orderBy({ index: 'startDate' }).run(connection);
  }
  catch (err) {
    console.log('getEmpListErr', err);
  }
  connection && connection.close()
  return employeeList.toArray();
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
