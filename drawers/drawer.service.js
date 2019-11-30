const { secret } = require('../config.json')
const jwt = require('jsonwebtoken')
const Role = require('../_helpers/role')
const bcrypt = require('bcryptjs')
const model = require('./drawer.rethinkdb.model.js')
const _ = require('lodash')

module.exports = {
  getDrawer
}

async function getDrawer (terminal) {
  console.log('servGetDrawer', terminal)
  // transactions will be returned as array
  let drawer = await model.getDrawerByLocation(terminal)
  console.log('getDrawResp', drawer)
  return drawer
}

async function getAllItems () {
  console.log('serviceAllItems')
  let items = await model.getAllItems()
  console.log('servRestAllItems', items)
  return items
}
