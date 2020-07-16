const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  saveDelivery,
  getDeliveryList,
  getDeliveryDates
};

// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'test'
}

async function getDeliveryDates () {
  let connection, deliveryDates
  try {
    console.log('++getDeliveryDates')
    connection = await r.connect(dbConfig)
    deliveryDates = await r.table('Deliveries').orderBy(r.desc(r.row('deliveryDate'))).map(function (delivery) {
      return delivery('deliveryDate')
    }).run(connection)
  }
  catch (err) {
    console.log('++getDeliveryDatesError'. err)
  }
  connection && connection.close()
  return deliveryDates
}

async function getDeliveryList (date) {
  let connection, deliveryList;
  try {
    console.log('+++getDeliveryList');
    connection = await r.connect(dbConfig);
    deliveryList = await r.table('Deliveries').orderBy(r.desc(r.row('deliveryDate'))).filter(r.row('deliveryDate').le(date)).limit(1).run(connection);
  }
  catch (err) {
    console.log('getDeliveryListErr', err);
  }
  connection && connection.close()
  return deliveryList.toArray();
}

async function saveDelivery (delivery) {
  let connection, deliveryResp
  try {
    console.log('+++saveDelivery')
    connection = await r.connect(dbConfig)
    deliveryResp = await r.table('Deliveries').insert(delivery, { conflict: 'replace' }).run(connection)
  }
  catch (err) {
    console.log('++saveDeliveryError', err)
  }
  connection && connection.close()
  return deliveryResp
}

/*
async function newEmployee (details) {
  let connection, resp;
  try {
    console.log('+++newEmployee', details);
    connection = await r.connect(dbConfig);
    // todo: separate method for updating record
    resp = await r.table('Employees').insert(details, { conflict: 'replace' }).run(connection);
  }
  catch (err) {
    console.log('++++newEmployeeError', err);
  }
  connection && connection.close()
  
  return resp;
}
*/
