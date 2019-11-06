const { secret } = require('../config.json')
const jwt = require('jsonwebtoken')
const Role = require('../_helpers/role')
const bcrypt = require('bcryptjs')
const model = require('./transaction.rethinkdb.model.js')
const _ = require('lodash')

module.exports = {
 incomeByDates 
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

