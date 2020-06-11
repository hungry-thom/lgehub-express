// const { secret } = require('../config.json')
// const jwt = require('jsonwebtoken')
// const Role = require('../../_helpers/role')
// const bcrypt = require('bcryptjs')
const model = require('./inventory.rethinkdb.model.js')
// const _ = require('lodash')

module.exports = {
  getItemNames,
  getItem,
  getAllItems,
  getInventory,
  getTagList
}

function localTimeOffset () {
  return new Date() - 21600000
}

async function getInventory (inv) { // currently unused
  console.log('====getInventory')
  let inventoryList = await model.getAllItems()
  let i = 0
  let itemList = []
  let tagList = []
  while (i < inventoryList.length) {
    if (!itemList.includes(inventoryList[i].item)) itemList.push(inventoryList[i].item)
    if (inventoryList[i].tags) tagList.push(...inventoryList[i].tags)
    // console.log('/////gotItems', i, itemList, tagList)
    i++
  }
  let uniqueTagList = [...new Set(tagList)]
  console.log('====itemInventoryList')
  return { 'items': itemList, 'tags': uniqueTagList }
}

async function getTagList () {
  console.log('====getTagList')
  let inventoryList = await model.getAllItems()
  let i = 0
  let tagList = []
  while (i < inventoryList.length) {
    if (inventoryList[i].tags) tagList.push(...inventoryList[i].tags)
    // console.log('/////gotItems', i, itemList, tagList)
    i++
  }
  let uniqueTagList = [...new Set(tagList)]
  console.log('====itemInventoryList')
  return uniqueTagList
}

async function getAllItems () {
  console.log('====getAllItems')
  let itemObjList = await model.getAllItems()
  console.log('====itemObjList')
  return itemObjList
}

async function getItem (item) {
  console.log('====getItem', item)
  let itemResp = await model.getItem(item)
  console.log('====itemResp', itemResp)
  return itemResp
}

async function getItemNames () {
  // todo: use limit for search, maybe 2 years?
  console.log('=====getItems')
  let itemList = await model.getItemNames()
  console.log('=====itemList', itemList)
  return itemList
}

async function listDrawers (startRow, endRow) {
  console.log('serviceListDrawer', startRow, endRow)
  // is it better to have separat 
  let drawerList = await model.getDrawerList(Number(startRow), Number(endRow))
  console.log('serviceListDrawerResp', drawerList)
  return drawerList
}

async function getDrawerListCount (terminal) {
  console.log('serviceGerDrawerListCount', terminal)
  let count = await model.getDrawerListCount(terminal)
  console.log('servieGetDrawerListCount Response', count)
  return count
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
    drawer.opening.timestamp = new Date(localTimeOffset()).toISOString()
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

async function navigateDrawer(terminal, timestamp, nav) {
  let drawer
  if (timestamp === 'null') {
    timestamp = new Date(localTimeOffset()).toISOString()
  }
  if (nav === 'prev') {
    console.log('serviceGetPrevDrawer')
    drawer = await model.getPrevDrawerByTerminal(terminal, timestamp)
  } else if (nav === 'next') {
    console.log('serviceGetNextDrawer')
    drawer = await model.getNextDrawerByTerminal(terminal, timestamp)
  } else {
    // incorrect nav command
    drawer = []
  }
  console.log('serviceGetPrevDrawerModelResp', drawer)
  if (drawer.length === 0) {
    // how to handle incorrect nav command
    console.log('serviceGetPrevDrawerError')
    return new Error('no Prev Drawer found')
  } else {
    console.log('servGetPrevDrawerSuccess')
    return drawer[0]
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
    drawer.closing.timestamp = new Date(localTimeOffset()).toISOString()
    let closedDrawer = await model.setClosingByDrawer(drawer)
    console.log('Draw Service set closeDraw resp', closedDrawer)
    if (closedDrawer.replaced === 1) {
      // success!
      return drawer
    } else 
      console.log('failed to update', closedDrawer)
    return new Error('service faiiled to close Drawer')
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
