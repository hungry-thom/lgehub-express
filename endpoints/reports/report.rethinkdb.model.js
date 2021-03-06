const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
//  newEmployee,
  getTransactions,
  getRevenueType,
  getRevenueAccount,
  getExpenseAccount,
  saveGroupList,
  getGroupList,
  getTransactionsIntact,
  getWeeklyRevenue
};

// const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'koox'
  // timeout: 120
}

async function getTransactions (startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601(endDate)))
    }).concatMap(function (item) {
      return item('transactionItems')
    }).run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  // connection && connection.close()

  return resp.toArray()
}

async function getWeeklyRevenue (startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(r.ISO8601(r.row('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(r.row('transactionDate')).lt(r.ISO8601(endDate))).and(r.row('transactionType').eq('revenue'))).run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  // connection && connection.close()

  return resp.toArray()
}

async function getTransactionsIntact (startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601(endDate)))
    }).run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  // connection && connection.close()

  return resp.toArray()
}

async function getRevenueType(startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601(endDate))).and(exp('transactionType').eq('revenue'))
    }).concatMap(function (item) {
      return item('transactionItems')
    }).run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  // connection && connection.close()

  return resp.toArray()
}

async function getRevenueAccount(startDate, endDate) {
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
    }).group('account').sum('amount').run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  connection && connection.close()

  return resp
}

async function getExpenseAccount(startDate, endDate) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601(startDate)).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601(endDate))).and(exp('transactionType').eq('expense'))
    }).concatMap(function(items) {
      return items('transactionItems')
      }).group('item').sum('cost').run(connection)
  }
  catch (err) {
    console.log('getRevenueError', err)
  }
  connection && connection.close()

  return resp
}

async function saveGroupList(groupList) {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('GroupList').insert(groupList, { conflict: "replace"}).run(connection)
  }
  catch (err) {
    console.log('saveGroupListError', err)
  }
  connection && connection.close()

  return resp
}

async function getGroupList() {
  let connection, resp
  try {
    connection = await r.connect(dbConfig)
    resp = await r.table('GroupList').run(connection)
  }
  catch (err) {
    console.log('saveGroupListError', err)
  }
  connection && connection.close()

  return resp.toArray()
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
