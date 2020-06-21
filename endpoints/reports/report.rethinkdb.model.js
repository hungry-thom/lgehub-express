const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
//  newEmployee,
  getRevenue
};

// const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'koox'
}

async function getRevenue(startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601(endDate)))
    }).concatMap(function(items) {
      return items('transactionItems').concatMap(function(i) {
        return i('credits').filter(function(account) {
          return account('account').match('(.*\\W|^)revenue(\\W.*|$)')
        })
      })
    }).sum('amount').run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  connection && connection.close()

  return resp
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
