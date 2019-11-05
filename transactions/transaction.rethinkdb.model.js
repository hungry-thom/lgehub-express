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
    transactions = await r.table('test').filter(function (trans) {
      return trans('transactionDate').le(endDate).and(trans('transactionDate').ge(startDate)).run(connection)
    })
  }
  catch (err) {
    console.log(err)
  }
  connection && connection.close()
  return transactionService.toArray()
}

