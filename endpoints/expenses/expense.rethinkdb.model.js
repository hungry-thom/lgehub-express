const r = require('rethinkdb')

module.exports = {
  getItemList
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function getItemList (startDate, earlierDate) {
  let connection, itemObjList
  console.log('++++getAllItems')
  try {
    connection = await r.connect(dbConfig)
    itemObjList = await r.table('trans').concatMap(function (trans) {
      return trans('transactionType').eq('expense').and(r.ISO8601(trans('transactionDate')).lt(r.ISO8601(startDate))).and(r.ISO8601(trans('transactionDate')).gt(r.ISO8601(earlierDate))).and(trans('transItems').filter(function (item) {
        return item
      }))
    }).run(connection)
  }
  catch (err) {
    console.log('++++itemObjListError', err)
  }
  connection && connection.close()
  return itemObjList.toArray()
}

/*
async function getItem (item) {
  let connection, itemResp
  console.log('++++itemResp', item)
  try {
    connection = await r.connect(dbConfig)
    itemResp = await r.table('trans').concatMap(function (trans) {
      return trans('transactionType').eq('expense').and(trans('transItems').filter(function (items) {
        return items('item').eq(item)
      }))
    }).run(connection)
  }
  catch (err) {
    console.log('++++++itemError', err)
  }
  connection && connection.close()
  console.log(itemResp)
  return itemResp.toArray()
}

async function getItemNames () {
  let connection, itemList
  console.log('+++++getItems')
  try {
    connection = await r.connect(dbConfig)
    itemList = await r.table('trans').concatMap(function (trans) {
      return trans('transactionType').eq('expense').and(trans('transItems').filter(function (items) {
        return items
      }))
    }).pluck('item').run(connection)
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
*/
