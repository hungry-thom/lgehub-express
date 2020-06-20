const model = require('./vendor.rethinkdb.model.js');

module.exports = {
  getVendors
};

async function getVendors () {
  const vendorList = await model.getVendors();
  return vendorList
}

/*
async function newEmployee (details) {
  console.log('===NewEmplyeedetails', details);
  const resp = await model.newEmployee(details);
  console.log('===newEmployee', resp);
  return resp
}
*/
