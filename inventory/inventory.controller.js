const express = require('express');
const router = express.Router();
const inventoryService = require('./inventory.service.js');
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

// routes
// router.get('/', authorize(Role.Admin), getAll); // admin only
// router.post('/closing', authorize(), closeDrawer);
// router.get('/:terminal/', authorize(), getActiveDrawerByTerminal);
router.get('/getitems/', authorize(), getItems);
module.exports = router;

function getItems (req, res, next) {
  console.log('----getItems-----');
  inventoryService.getItems()
  .then(itemList => {
    console.log('---itemList')
    res.json(itemList)
  }). catch(err => {
    console.log('---itemListError')
    next(err)
  })
}


/*
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
