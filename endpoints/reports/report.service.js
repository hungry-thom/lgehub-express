const model = require('./report.rethinkdb.model.js');

module.exports = {
//  newEmployee
  getRevenue,
  getPandL
};


async function  getPandL (startDate, endDate) {
  let sDate = new Date(startDate) // new Date setsHours(0,0,0,0)
  let eDate = new Date(endDate)
  console.log('dates', sDate, eDate)
  const allTransactions = await model.getTransactions(sDate.toISOString(), eDate.toISOString()); // get list of revenuegrouped by account with total amount
  let dex = 0
  let locationList = []
  let month = {}
  month['col'] = sDate.toLocaleString('en-EN', { month: 'short', year: 'numeric' }).split(' ').join('')
  month['revenue'] = { 'restaurant': 0, 'meatshop': 0, 'farm': 0, 'revTotal': 0 }
  month['COGS'] = { 'restaurant': 0, 'meatshop': 0, 'farm': 0, 'lge': 0, 'subTotal': 0, 'cogsRatio': 0 }
  month['opExp'] = { 'restaurant': 0, 'meatshop': 0, 'farm': 0, 'lge': 0, 'subTotal': 0, 'opExpRatio': 0 }
  month['wages'] = { 'restaurant': 0, 'meatshop': 0, 'farm': 0, 'lge': 0, 'subTotal': 0, 'wagesRatio': 0 }
  month['income'] = { 'netIncome': 0, 'netIncomeRatio': 0 }
  while (dex < allTransactions.length) {
    let transaction = allTransactions[dex]
    // currently all revenue is recorded as credit. Discounts are -credit
    transaction['credits'].map(c => {
      let acc = c['account']
      let amt = c['amount']
      if (acc.includes('revenue')) {
        let business = acc.split('::')[2]
        month['revenue'][business] += amt
        month['revenue']['revTotal'] += amt
        month['income']['netIncome'] += amt
      }
    })
    transaction['debits'].map(d => {
      let acc = d['account']
      let amt = d['amount']
      if (acc.includes('expense')) {
        let expenseDeets = acc.split('::')
        let kind = expenseDeets[2]
        let business = expenseDeets[3]
        if (kind !== 'employee') {
          month[kind][business] += amt
          month[kind][`subTotal`] += amt
          month['income']['netIncome'] -= amt
        }
      }
    })
    ++dex
  }
  // todo: figure ratios
  return month
}


async function  getRevenue (startDate, endDate) {
  let sDate = new Date(startDate) // new Date setsHours(0,0,0,0)
  let eDate = new Date(endDate)
  console.log('dates', sDate, eDate)
  /*
  eDate = eDate.setUTCHours(23,59,59,999) // switched to non inclusive endDate (day after)
  let ed = new Date(eDate) // eDate doesnt have toISOString after set hours?
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
