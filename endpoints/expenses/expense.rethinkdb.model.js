const r = require('rethinkdb')
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  getItemList
}

// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'koox'
}

async function getItemList (startDate, earlierDate) {
  let connection, itemObjList
  console.log('++++getAllItems')
  try {
    connection = await r.connect(dbConfig)
    itemObjList = await r.table('Transactions').filter(function(exp) {
      return r.ISO8601(exp('transactionDate')).ge(r.ISO8601('2019-11-01T00:01:00.000Z')).and(r.ISO8601(exp('transactionDate')).lt(r.ISO8601('2020-07-01T00:01:00.000Z'))).and(exp('transactionType').eq('expense'))
    }).concatMap(function(items) {
      return items('transactionItems')
    }).run(connection)
    /*
    itemObjList = await r.table('Transactions').concatMap(function (trans) {
      return trans('transactionType').eq('expense').and(r.ISO8601(trans('transactionDate')).lt(r.ISO8601(startDate))).and(r.ISO8601(trans('transactionDate')).gt(r.ISO8601(earlierDate))).and(trans('transactionItems').filter(function (item) {
        return item
      }))
    }).run(connection)
    */
  }
  catch (err) {
    console.log('++++itemObjListError', err)
  }
  // connection && connection.close()
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
