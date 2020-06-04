const model = require('./delivery.rethinkdb.model.js');

module.exports = {
  getDeliveryList,
  saveDelivery,
  getDeliveryDates
};

async function getDeliveryDates () {
  console.log('==getDeliveryDates')
  const resp = await model.getDeliveryDates()
  console.log('===DeliveryDates')
  return resp
}

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
