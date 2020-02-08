const r = require('rethinkdb')

module.exports = {
  incomeByDates,
  getAllItems,
  postNewExpense,
  listExpenses,
  getVendorList
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function getVendorList (type) {
  console.log('++++getVendorList')
  let connection, vendorList
  try {
    connection = await r.connect(dbConfig)
    vendorList = await r.table('trans').filter(r.row('transactionType').eq(type)).distinct().pluck('vendor').run(connection)
  } catch (err) {
    console.log('++++getVendorlistError', err)
  }
  connection && connection.close()
  return vendorList.toArray()
}

async function listExpenses (startDate, endDate) {
  let connection, expenseList
  try {
    connection = await r.connect(dbConfig)
    expenseList = await r.table('trans').orderBy(r.desc(r.row('transactionDate'))).filter(r.ISO8601(r.row('transactionDate')).le(r.ISO8601(endDate)).and(r.ISO8601(r.row('transactionDate')).ge(r.ISO8601(startDate)))).run(connection)
  } catch (err) {
    console.log(err)
  }
  connection && connection.close()
  return expenseList.toArray()
}

async function postNewExpense (transaction) {
  let connection, result
  try {
    connection = await r.connect(dbConfig)
    result = await r.table('trans').insert(transaction).run(connection)
  }
  catch (err) {
    console.log(err)
  }
  connection && connection.close()
  return result
}

async function incomeByDates (startDate, endDate) {
  let connection , transactions
  try {
    connection = await r.connect(dbConfig)
    transactions = await r.table('test').between(endDate, startDate, {index: "transactionDate"}).run(connection)
    /*
    transactions = await r.table('test').filter(function (t) {
      console.log(t('transactionDate'))
      return t('transactionDate').le(endDate).and(t('transactionDate').ge(startDate))
    }).run(connection)
    */
  }
  catch (err) {
    console.log(err)
  }
  connection && connection.close()
  return transactions.toArray()
}

async function getAllItems() {
  let connection, items
  try {
    connection = await r.connect(dbConfig)
    items = await r.table('test').concatMap(function(transaction) {
      return transaction('debit').filter(function(deb) {
        return deb('item')
      })
    }).run(connection)
  }
  catch (err) {
    console.log('err reGetAllItems', err)
  }
  connection && connection.close()
  return items.toArray()
}
