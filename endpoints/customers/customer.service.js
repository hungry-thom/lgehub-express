const model = require('./customer.rethinkdb.model.js');

module.exports = {
  newCustomer,
  getCustomerList,
  getDeliveryList
};

async function getDeliveryList () {
  console.log('===getDeliveryList')
  const deliveryList = await model.getDeliveryList()
  console.log('===deliveryList', deliveryList)
  return deliveryList
}

async function getCustomerList () {
  console.log('===getCustomerLIst')
  const custList = await model.getCustomerList()
  console.log('===custList', custList)
  return custList
}

async function newCustomer (details) {
  console.log('===NewEmplyeedetails', details);
  const resp = await model.newCustomer(details);
  console.log('===newCustomer', resp);
  return resp
}
