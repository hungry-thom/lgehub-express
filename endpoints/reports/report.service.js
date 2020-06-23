const model = require('./report.rethinkdb.model.js');

module.exports = {
//  newEmployee
  getRevenue
};

async function  getRevenue (startDate, endDate) {
  let sDate = new Date(startDate) // new Date setsHours(0,0,0,0)
  let eDate = new Date(endDate)
  /*
  eDate = eDate.setUTCHours(23,59,59,999) // switched to non inclusive endDate (day after)
  let ed = new Date(eDate) // eDate doesnt have toISOString after set hours?
  console.log('dates', sDate, ed)
  */
  // const resp = await model.getRevenueBasic(sDate.toISOString(), ed.toISOString());
  const resp = await model.getRevenue(sDate.toISOString(), eDate.toISOString()); // get list of revenuegrouped by account with total amount
  let dex = 0
  let locationList = []
  while (dex < resp.length) {
    let group = resp[dex]
    group['account'] = group.group.split('::')[2]
    group['group'] = group.group.split('::')[3]
    let accountDex = locationList.findIndex(x => {
      return x.account === group.account
    })
    if (accountDex > -1) {
      let sum = locationList[accountDex].reduction + group.reduction
      sum = Math.round((sum + Number.EPSILON) * 100) / 100
      locationList[accountDex].reduction = sum
      /* /////// WILL LEAVE THE GROUP BREAKDOWN FOR DETAILED QUERY ///////////
      locationList[accountDex].groups.push({ 
        'group': group.group,
        'reduction': Math.round((group.reduction + Number.EPSILON) * 100) / 100
      })
      ////////////////////////////////////////////////////////////////////// */
    } else {
      locationList.push({
        'account': group.account,
        'reduction': group.reduction
      /* /////// WILL LEAVE THE GROUP BREAKDOWN FOR DETAILED QUERY ///////////
        'groups': [{
          'group': group.group,
          'reduction': Math.round((group.reduction + Number.EPSILON) * 100) / 100
        }]
      ////////////////////////////////////////////////////////////////////// */
      })
    }
    ++dex
  }
  return locationList
}

/*
async function newEmployee (details) {
  console.log('===NewEmplyeedetails', details);
  const resp = await model.newEmployee(details);
  console.log('===newEmployee', resp);
  return resp
}
*/
