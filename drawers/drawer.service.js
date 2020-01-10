// const { secret } = require('../config.json')
// const jwt = require('jsonwebtoken')
// const Role = require('../_helpers/role')
// const bcrypt = require('bcryptjs')
const model = require('./drawer.rethinkdb.model.js')
// const _ = require('lodash')

module.exports = {
  getActiveDrawerByTerminal,
  setOpening,
  setClosing
}

async function getActiveDrawerByTerminal (terminal) {
  console.log('servGetDrawer', terminal)
  // transactions will be returned as array
  let drawer = await model.getActiveDrawerByTerminal(terminal)
  console.log('getDrawResp', drawer)
  return drawer
}

async function setOpening (drawer) {
  console.log('servOpenDrawer', drawer)
  // check that there is no active drawer
  let activeTerminalDrawer = await model.getActiveDrawerByTerminal(drawer.terminal)
  if (activeTerminalDrawer.length === 0) {
    // no currently active drawer found, we can now activae new drawer
    console.log('no actie terminal ready to open', activeTerminalDrawer.length)
    drawer.status = 'active'
    drawer.opening.timestamp = new Date().toISOString()
    console.log('check', drawer)
    let openDrawer = await model.setOpeningByDrawer(drawer)
    console.log('serviceOPenDrawerResp', openDrawer)
    if(openDrawer.inserted === 1) {
      drawer['id'] = openDrawer.generated_keys[0]
      return drawer
    } else {
      return new Error(`no active terminal, but attempt to open drawer failed`)
    }
  } else {
    console.log('setOpeningServiceError')
    return new Error(`active ${drawer.terminal} drawer present`)
  }
}

async function setClosing (drawer) {
  console.log('serviceCloseDrawer', drawer)
  // check that there is active drawer and opening is set
  let activeOpenTerminalDrawer = await model.getActiveDrawerByTerminal(drawer.terminal)
  console.log('serviceSetClosingCheckResult', activeOpenTerminalDrawer)
  if (activeOpenTerminalDrawer.length === 0) {
    // error, there should be an active 
    return Promise.reject(new Error(`no active open ${drawer.terminal} drawer found`))
  } else {
    // active drawer found. may want to check for opening timestamp
    drawer.status = 'closed'
    drawer.closing.timestamp = new Date().toISOString()
    let closedDrawer = await model.setClosingByDrawer(drawer)
    console.log('Draw Service set closeDraw resp', closedDrawer)
    if (closedDrawer.replaced === 1) {
      // success!
      return drawer
    } else 
      console.log('failed to update', closedDrawer)
    return 
  }
  /*
  if (activeTerminalDrawer.length === 0) {
    console.log('no actie terminal ready to open', activeTerminalDrawer.length)
    drawer.status = 'active'
    drawer.opening.timestamp = new Date().toISOString()
    console.log('check', drawer)
    let openDrawer = await model.setOpeningByDrawer(drawer)
    console.log('serviceOPenDrawerResp', openDrawer)
    return openDrawer
  } else {
    console.log('setOpeningServiceError')
    return Promise.reject(new Error(`active ${drawer.terminal} drawer present`))
  }
  */
}
