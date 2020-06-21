const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
//  newEmployee,
  getVendors
};

// const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'test'
}

async function getVendors () {
  let connection, cursor
  try {
    connection = await r.connect(dbConfig);
    cursor = await r.table('Vendors').run(connection);
  }
  catch (err) {
    console.log('getVendorsError');
  }
  connection && connection.close()

  return cursor.toArray()
}

/*
async function newEmployee (details) {
  let connection, resp;
  try {
    console.log('+++newEmployee', details);
    connection = await r.connect(dbConfig);
    // todo: separate method for updating record
    resp = await r.table('Employees').insert(details, { conflict: 'replace' }).run(connection);
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
*/
