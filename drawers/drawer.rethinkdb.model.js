const r = require('rethinkdb')

module.exports = {
  getActiveDrawerByTerminal,
  getDrawerByLocation,
  setOpeningByDrawer,
  setClosingByDrawer
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
    drawer = await r.table('drawers').filter(r.row('terminal').eq(terminal).and(r.row('status').eq('active'))).run(connection)
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

async function setOpeningByDrawer (draw) {
  let connection , drawer
  console.log('ModelopenDrawer')
  try {
    connection = await r.connect(dbConfig)
    drawer = await r.table('drawers').insert(draw).run(connection)
  }
  catch (err) {
    console.log('ModelOpenDrawerError', err)
  }
  connection && connection.close()
  console.log('drawer', drawer)
  return drawer
}

async function getActiveDrawerByTerminal(terminal) {
  let connection, drawer
  console.log('checkActiveOpenTerminla')
  try {
    connection = await r.connect(dbConfig)
    drawer = await r.table('drawers').filter(r.row('terminal').eq(terminal).and(r.row('status').eq('active'))).run(connection)
  }
  catch (err) {
    console.log('checkActieOPenError', err)
  }
  connection && connection.close()
  return drawer.toArray()
}

async function setClosingByDrawer (draw) {
  let connection , drawer
  console.log('ModelCloseDrawer')
  try {
    connection = await r.connect(dbConfig)
    drawer = await r.table('drawers').get(draw.id).replace(draw).run(connection)
  }
  catch (err) {
    console.log('ModelOpenDrawerError', err)
  }
  connection && connection.close()
  console.log('drawer', drawer)
  return drawer
}
/*
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
*/