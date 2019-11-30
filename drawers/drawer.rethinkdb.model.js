const r = require('rethinkdb')

module.exports = {
  getDrawerByLocation,
  getAllItems
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function getDrawerByLocation (terminal) {
  let connection , drawer
  console.log('getDrawerWuery')
  try {
    connection = await r.connect(dbConfig)
    drawer = await r.table('drawers').filter(r.row('location').eq(terminal).and(r.row('status').eq('active'))).run(connection)
    /*
    transactions = await r.table('test').filter(function (t) {
      console.log(t('transactionDate'))
      return t('transactionDate').le(endDate).and(t('transactionDate').ge(startDate))
    }).run(connection)
    */
  }
  catch (err) {
    console.log('error', err)
  }
  connection && connection.close()
  console.log('drawer', drawer)
  return drawer.toArray()
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
