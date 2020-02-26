const r = require('rethinkdb');

module.exports = {
//  newEmployee,
  getDeliveryList
};

const hostConf = '192.168.100.102'
// const hostConf = 'localhost'
const dbConfig = {
  host: hostConf,
  port: 28015,
  db: 'test'
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
