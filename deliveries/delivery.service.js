const model = require('./delivery.rethinkdb.model.js');

module.exports = {
  getDeliveryList
};

async function getDeliveryList(date) {
  console.log('===NewEmplyeedetails', date);
  const resp = await model.getDeliveryList(date);
  console.log('===newEmployee', resp);
  return resp
}
