const model = require('./report.rethinkdb.model.js');

module.exports = {
//  newEmployee
  getRevenue
};

async function  getRevenue (startDate, endDate) {
  const resp = await model.getRevenue(startDate, endDate);
  return resp
}

/*
async function newEmployee (details) {
  console.log('===NewEmplyeedetails', details);
  const resp = await model.newEmployee(details);
  console.log('===newEmployee', resp);
  return resp
}
*/
