const r = require('rethinkdb');
const config = require('../../ngrok.json')
const HOST = config.host

module.exports = {
  newCustomer,
  getCustomerList,
  getDeliveryList
};

// const hostConf = 'localhost'
const dbConfig = {
  host: HOST,
  port: 28015,
  db: 'test'
}

async function getDeliveryList () {
  let connection, deliveryList;
  try {
    console.log('+++getCustList');
    connection = await r.connect(dbConfig);
    deliveryList = await r.table('Delivery').run(connection);
  }
  catch (err) {
    console.log('getCustListErr', err);
  }
  connection && connection.close()
  return deliveryList.toArray();
}

async function getCustomerList () {
  let connection, customerList;
  try {
    console.log('+++getCustList');
    connection = await r.connect(dbConfig);
    customerList = await r.table('Customers').run(connection);
  }
  catch (err) {
    console.log('getCustListErr', err);
  }
  connection && connection.close()
  return customerList.toArray();
}

async function newCustomer (details) {
  let connection, resp;
  try {
    console.log('+++newCustomer', details);
    connection = await r.connect(dbConfig);
    // todo: separate method for updating record
    resp = await r.table('Customers').insert(details, { conflict: 'replace' }).run(connection);
  }
  catch (err) {
    console.log('++++newCustomerError', err);
  }
  connection && connection.close()
  
  return resp;
}
