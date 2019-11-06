const r = require('rethinkdb')

module.exports = {
 incomeByDates 
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
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

