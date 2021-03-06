const r = require('rethinkdb')
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  getItemNames,
  getItem,
  getAllItems
}

// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'koox'
}

async function getAllItems () {
  let connection, itemObjList
  console.log('++++getAllItems')
  try {
    connection = await r.connect(dbConfig)
    itemObjList = await r.table('Transactions').filter(r.row('transactionType').eq('expense')).concatMap(function (trans) {
      return trans('transactionItems')
    }).run(connection)
  }
  catch (err) {
    console.log('++++itemObjListError', err)
  }
  // connection && connection.close()
  return itemObjList.toArray()
}

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
