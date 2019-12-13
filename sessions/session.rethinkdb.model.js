const r = require('rethinkdb')

module.exports = {
  openSession,
  createSession,
  getAllItems
}

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
}

async function openSession ( username ) {
  let connection , openedSession
  try {
    connection = await r.connect(dbConfig)
    openedSession = await r.table('sessions').filter(r.row('username').eq(username).and(r.row('status').eq('active'))).run(connection)
  }
  catch (err) {
    console.log(err)
  }
  connection && connection.close()
  console.log('rethinkCreateSession', openedSession)
  return openedSession.toArray()
}

async function createSession ( newSession ) {
  let connection , createdSession
  try {
    connection = await r.connect(dbConfig)
    createdSession = await r.table('sessions').insert(newSession).run(connection)
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
  console.log('rethinkCreateSession', createdSession)
  return createdSession
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
