const model = require('./delivery.rethinkdb.model.js');

module.exports = {
  getDeliveryList,
  saveDelivery
};

async function getDeliveryList(date) {
  console.log('===NewEmplyeedetails', date);
  const resp = await model.getDeliveryList(date);
  console.log('===newEmployee', resp);
  return resp
}

async function saveDelivery(delivery) {
  console.log('==saveDelivery')
  const resp = await model.saveDelivery(delivery)
  console.log('==saveDeliveryResp', resp)
  return resp
}
