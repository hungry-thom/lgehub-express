const express = require('express');
const router = express.Router();
const expenseService = require('./expense.service.js');
const authorize = require('../../_helpers/authorize');
const Role = require('../../_helpers/role');

// routes
// router.get('/', authorize(Role.Admin), getAll); // admin only
// router.post('/closing', authorize(), closeDrawer);
// router.get('/:terminal/', authorize(), getActiveDrawerByTerminal);
router.get('/getitemlist', getItemList);
router.get('/getExpense/:id', getExpense);
router.get('/findid', findId);
module.exports = router;

function findId (req, res, next) {
  expenseService.findId(req.query.vendor, req.query.num)
  .then(expId => {
    res.json(expId)
  }).catch(err => {
    console.log('---controllerFindIdError', err)
  })
}

function getItemList (req, res, next) {
  console.log('---controlExpGetItemList')
  expenseService.getItemList(req.query.startDate, req.query.earlierDate)
  .then(itemList => {
    console.log('---controlExpReturnItemList')
    res.json(itemList)
  }).catch(err => {
    console.log('---controlExpItemListError', err)
  })
}

function getExpense (req, res, next) {
  expenseService.getExpense(req.params.id)
  .then(expense => {
    res.json(expense)
  }).catch(err => {
    console.log('getExepsneError', err)
  })
}

/*
function getInventory (req, res, next) {
  console.log('----getInventory')
  inventoryService.getInventory(req.params.inv)
  .then(inventoryList => {
    console.log('----inventoryList')
    res.json(inventoryList)
  }).catch(err => {
    console.log('----inventoryListError', err)
  })
}

function getAllItems (req, res, next) {
  console.log('----getAllItems')
  inventoryService.getAllItems()
  .then(itemObjList => {
    console.log('----itemObjList')
    res.json(itemObjList)
  }).catch(err => {
    console.log('----itemObjListError', err)
  })
}

function getItemNames (req, res, next) {
  console.log('----getItems-----');
  inventoryService.getItemNames()
  .then(itemList => {
    console.log('---itemList')
    res.json(itemList)
  }). catch(err => {
    console.log('---itemListError')
    next(err)
  })
}

function getItem (req, res, next) {
  console.log('----getItem-----')
  inventoryService.getItem(req.params.item)
  .then(item => {
    console.log('---item')
    res.json(item)
  }).catch(err => {
    console.log('---getItemError', err)
    next(err)
  })
}


function openDrawer (req, res, next) {
  console.log('reqOpenDrawer', req.body);
  drawerService.setOpening(req.body)
  .then(response => res.json(response))
  .catch(err => next(err));
}

function getActiveDrawerByTerminal (req, res, next) {
  console.log('reqGetDrawer', req.params)
  console.log('test', req.query)
  drawerService.getActiveDrawerByTerminal(req.params.terminal)
  .then(drawer => res.json(drawer))
  .catch(err => next(err));
}
*/
