const { secret } = require('../config.json')
const jwt = require('jsonwebtoken')
const Role = require('../_helpers/role')
const bcrypt = require('bcryptjs')
const model = require('./transaction.rethinkdb.model.js')
const _ = require('lodash')

module.exports = {
  incomeByDates,
  getAllItems,
  postNewExpense,
  listExpenses,
  listAll
}

async function listAll (startDate, endDate) {
  console.log('---listExpenses')
  if (endDate === 'null') {
    endDate = new Date().toISOString()
  }
  console.log(startDate, endDate)
  let transList = await model.listExpenses(startDate, endDate)
  console.log('---listAllResp', transList)
  transList.forEach(t => {
    t.transItems.forEach(item => {
      t['assetTotal'] = 0
      t['equityTotal'] = 0
      item.debits.forEach(debit => {
        let parse = debit.account.split('/')
        if (['receivable', 'prepaid', 'inventory', 'cash', 'check', 'equipment'].includes(parse[0])) {
          // asset, debit increases amount
          t['assetTotal'] += debit.amount
          if (t[parse[0]]) {
            t[parse[0]] += debit.amount
          } else {
            t[parse[0]] = debit.amount
          }
        } else if (['payable', 'expense', 'sale', 'capital'].includes(parse[0])) {
          // equity, debit decreases amount
          t['equityTotal'] -= debit.amount
          if (t[parse[0]]) {
            t[parse[0]] -= debit.amount
          } else {
            t[parse[0]] =- debit.amount
          }
        } else {
          console.log('error with debit account', debit)
        }
        t[parse[0]] = _.round(t[parse[0]], 2)
      })
      item.credits.forEach(credit => {
        let parse = credit.account.split('/')
        if (['receivable', 'prepaid', 'inventory', 'cash', 'check', 'equipment'].includes(parse[0])) {
          // asset, credit decreases amount
          t['assetTotal'] -= credit.amount
          if (t[parse[0]]) {
            t[parse[0]] -= credit.amount
          } else {
            t[parse[0]] =- credit.amount
          }
        } else if (['payable', 'expense', 'sale', 'capital'].includes(parse[0])) {
          // equity, credit increases amount
          t['equityTotal'] += credit.amount
          if (t[parse[0]]) {
            t[parse[0]] += credit.amount
          } else {
            t[parse[0]] = credit.amount
          }
        } else {
          console.log('error with credit account', credit)
        }
        t[parse[0]] = _.round(t[parse[0]], 2)
      })
    })
    t['assetTotal'] = _.round(t['assetTotal'], 2)
    t['equityTotal'] = _.round(t['equityTotal'], 2)
  })
  return transList
}

async function listExpenses (startDate, endDate) {
  console.log('---listExpenses')
  if (endDate === 'null') {
    endDate = new Date().toISOString()
  }
  console.log(startDate, endDate)
  let expenseList = await model.listExpenses(startDate, endDate)
  console.log('---listExpenseResp', expenseList)
  return expenseList
}

async function postNewExpense (body) {
  console.log('servicePostNewExperience')
  let newExpenseResp = await model.postNewExpense(body)
  console.log('serviceNewExpenseResp', newExpenseResp)
  return newExpenseResp
}

async function incomeByDates (startDate, endDate) {
  console.log('serv', startDate, endDate)
  // transactions will be returned as array
  let transactions = await model.incomeByDates(startDate, endDate)
  console.log('reResp', transactions)
  let rev = 0
  let exp = 0
  transactions.forEach(trans => {
    trans.credit.forEach(c => {
      if (c.account === 'revenue') {
        rev += c.amount
      }
    })
    trans.debit.forEach(d => {
      if (d.account === 'expense') {
        exp += d.amount
      }
    })
  })
  return { revenue: _.round(rev,2), expense: _.round(exp, 2)}
}

async function getAllItems () {
  console.log('serviceAllItems')
  let items = await model.getAllItems()
  console.log('servRestAllItems', items)
  return items
}
