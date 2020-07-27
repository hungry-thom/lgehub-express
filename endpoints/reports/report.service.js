const model = require('./report.rethinkdb.model.js');

module.exports = {
//  newEmployee
  getRevenue,
  getPandL,
  getMonthly,
  getDaily, 
  getRevenueAccount,
  getExpenseAccount,
  saveGroupList,
  getGroupList,
  getBalanceSheet
};

async function getDaily(query) {
  console.log('getMonthly', query)
  let itemList = []
  let transactions = await model.getTransactions(query.startDate, query.endDate)
  let dex = 0
  while (dex < transactions.length) {
    let transaction  = transactions[dex]
    // NOTE: receivePayment TransactionType, does not have ref
    if (transaction.ref && transaction.ref.includes('revenue')) {
      // need to classify which business
      let business
      transaction.credits.map(credit => {
        let amount = 0
        let account = ''
        if (credit.account.includes('equity')) {
          // can get businessID
          let breakdown = credit.account.split(';;')
          business = breakdown[2] ? breakdown[2] : ''
          account = credit.account.split('::')[1]
          amount += credit.amount
        }
        let businessIndex = businessList.findIndex(b => b.business === business)
        // if businessList[businessIndex].
      })
    }
    dex++
  }
  return transactions
}

async function getMonthly(acct, query) {
  console.log('getMonthly', acct, query)
  let itemList = []
  let transactions = await model.getRevenueType(query.startDate, query.endDate)
  let dex = 0
  while (dex < transactions.length) {
    let transaction  = transactions[dex]
    let itemIndex = itemList.findIndex(i => i.item === transaction.item)
    if (itemIndex < 0) {
      let newItem = {
        item: transaction.item,
        totalCost: transaction.cost,
        totalQty: transaction.qty || 1
      }
      itemList.push(newItem)
    } else {
      itemList[itemIndex].totalCost += transaction.cost
      itemList[itemIndex].totalQty += transaction.qty || 1
    }
    dex++
  }
  return itemList
}

async function  getBalanceSheet (startDate, endDate) {
  let sDate = new Date(startDate) // new Date setsHours(0,0,0,0)
  let eDate = new Date(endDate)
  console.log('dates', sDate, eDate)
  const allTransactions = await model.getTransactionsIntact(sDate.toISOString(), eDate.toISOString()); // get list of revenuegrouped by account with total amount
  // parse each transaction into ['vendor/customer', 'transNum', 'acctRec', 'prepaid', 'cash', '=>', '<=', 'payable', 'expense', 'revenue']
  console.log('allTransactions', allTransactions.length)
  let transDex = 0
  let balanceSheetList = [{}]
  let grandTotal = balanceSheetList[0]
  grandTotal['acctRec'] = 0
  grandTotal['prepaid'] = 0
  grandTotal['cash'] = 0
  grandTotal['=>'] = 0
  grandTotal['<='] = 0
  grandTotal['payable'] = 0
  grandTotal['gst'] = 0
  grandTotal['expense'] = 0
  grandTotal['revenue'] = 0
  while (transDex < allTransactions.length) {
    let trans = allTransactions[transDex]
    if (trans.transactionType === 'transfer') break
    let row = {}
    row['id'] = trans.id
    row['name'] = trans.vendor || trans.customer
    row['transNum'] = trans.transactionNum
    row['=>'] = 0
    row['<='] = 0
    let itemsDex = 0
    while (itemsDex < trans.transactionItems.length) {
      let item = trans.transactionItems[itemsDex]
      item.credits.map(cr => {
        let details = cr.account.split('::')
        let account = details[1]
        if (['equity', 'liability'].includes(details[0])) {
          let factor = (account === 'expense') ? -1 : 1
          if (row[account]) {
            row[account] += (cr.amount * factor)
          } else {
            row[account] = (cr.amount * factor)
          }
          row['<='] += cr.amount
          grandTotal['<='] += cr.amount
          grandTotal[account] += (cr.amount * factor)
        } else {
          if (row[account]) {
            row[account] -= cr.amount
          } else {
            row[account] = (cr.amount * -1)
          }
          row['=>'] -= cr.amount
          grandTotal['=>'] -= cr.amount
          grandTotal[account] -= cr.amount
        }
      })
      item.debits.map(dr => {
        let details = dr.account.split('::')
        let account = details[1]
        if (details[0] === 'equity') {
          // let factor = (account === 'expense') ? -1 : 1
          if (row[account]) {
            row[account] -= (dr.amount)
          } else {
            row[account] = (dr.amount * -1)
          }
          row['<='] -= dr.amount
          grandTotal['<='] -= dr.amount
          grandTotal[account] -= dr.amount
        } else {
          if (row[account]) {
            row[account] += dr.amount
          } else {
            row[account] = dr.amount
          }
          row['=>'] += dr.amount
          grandTotal['=>'] += dr.amount
          grandTotal[account] += dr.amount
        }
      })
      itemsDex++
    }
    balanceSheetList.push(row)
    transDex++
  }
  return balanceSheetList
}

async function  getPandL (startDate, endDate) {
  let sDate = new Date(startDate) // new Date setsHours(0,0,0,0)
  let eDate = new Date(endDate)
  console.log('dates', sDate, eDate)
  const allTransactions = await model.getTransactions(sDate.toISOString(), eDate.toISOString()); // get list of revenuegrouped by account with total amount
  let dex = 0
  let locationList = []
  let month = {}
  let monthYear = sDate.toUTCString().split(' ')
  month['col'] = `${monthYear[2]}${monthYear[3]}`
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

async function saveGroupList (groupList) {
  let resp = await model.saveGroupList(groupList)
  return resp
}

async function getGroupList () {
  let resp = await model.getGroupList()
  return resp
}

async function getRevenueAccount (startDate, endDate) {
  let sDate = new Date(startDate).toISOString()
  let eDate = new Date(endDate).toISOString()
  console.log(sDate, eDate)
  let resp = await model.getRevenueAccount(sDate, eDate)
  return resp
}

async function getExpenseAccount (startDate, endDate) {
  let sDate = new Date(startDate).toISOString()
  let eDate = new Date(endDate).toISOString()
  console.log(sDate, eDate)
  let resp = await model.getExpenseAccount(sDate, eDate)
  return resp
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
  const resp = await model.getRevenueAccount(sDate.toISOString(), eDate.toISOString()); // get list of revenuegrouped by account with total amount
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
