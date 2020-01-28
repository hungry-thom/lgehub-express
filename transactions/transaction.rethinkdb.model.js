const r = require('rethinkdb')

module.exports = {
  incomeByDates,
  getAllItems,
  postNewExpense
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
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
