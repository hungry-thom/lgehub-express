const r = require('rethinkdb')
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  incomeByDates,
  getAllItems,
  postNewExpense,
  listExpenses,
  getVendorList,
  getById
}

// const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'test'
}

async function getById (id) {
  console.log('++++getById', id)
  let connection, transaction
  try {
    connection = await r.connect(dbConfig)
    transaction = await r.table('trans').get(id).run(connection)
  } catch (err) {
    console.log('++++getByIdError', err)
  }
  connection && connection.close()
  console.log('resp', transaction)
  return transaction
}

async function getVendorList (type) {
  console.log('++++getVendorList')
  let connection, vendorList
  try {
    connection = await r.connect(dbConfig)
    vendorList = await r.table('trans').filter(r.row('transactionType').eq(type)).pluck('vendor').distinct().run(connection)
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
    result = await r.table('trans').insert(transaction, { conflict: 'replace' }).run(connection)
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
