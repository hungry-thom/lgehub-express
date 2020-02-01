const r = require('rethinkdb')

module.exports = {
  getItems
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function getItems () {
  let connection, itemList
  console.log('+++++getItems')
  try {
    connection = await r.connect(dbConfig)
    itemList = await r.table('trans').concatMap(function (trans) {
      return trans('transactionType').eq('expense').and(trans('transItems').filter(function (items) {
        return items
      }))
    }).run(connection)
  }
  catch (err) {
    console.log('++++++itemListError')
  }
    connection && connection.close()
    return itemList.toArray()
  }

async function getDrawerList (startRow, endRow) {
  let connection, drawerList
  console.log('modelGetDrawerList')
  try {
    connection = await r.connect(dbConfig)
    drawerList = await r.table('drawers').orderBy(r.desc(r.row('opening')('timestamp'))).slice(startRow, endRow).run(connection)
  }
  catch (err) {
    console.log('modelGetDrawerListError', err)
  }
  connection && connection.close()
  return drawerList.toArray()
}
