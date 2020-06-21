const model = require('./report.rethinkdb.model.js');

module.exports = {
//  newEmployee
  getRevenue
};

async function  getRevenue (startDate, endDate) {
  let sDate = new Date(startDate)
  // sDate = sDate.setHours(0,0,0,0)
  // sDate = sDate.toISOString()
  let eDate = new Date(endDate)
  eDate = eDate.setUTCHours(23,59,59,999)
  let ed = new Date(eDate)
  console.log('dates', sDate, ed)
  const resp = await model.getRevenue(sDate.toISOString(), ed.toISOString());
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
