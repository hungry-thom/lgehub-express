const express = require('express');
const router = express.Router();
const drawerService = require('./drawer.service.js');
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

// routes
// router.get('/', authorize(Role.Admin), getAll); // admin only
router.post('/opening', authorize(), openDrawer);
router.post('/closing', authorize(), closeDrawer);
router.get('/:terminal/', authorize(), getActiveDrawerByTerminal);
router.get('/:terminal/:timestamp/prev/', authorize(), getPrevDrawer);
module.exports = router;

function openDrawer (req, res, next) {
  console.log('reqOpenDrawer', req.body);
  drawerService.setOpening(req.body)
  .then(response => res.json(response))
  .catch(err => next(err));
}

function closeDrawer (req, res, next) {
  console.log('contrCloseDrawer');
  drawerService.setClosing(req.body)
  .then(response => {
    console.log('contrServiceResponse', response)
    res.json(response)
  })
  .catch(err => next(err));
}

function getActiveDrawerByTerminal (req, res, next) {
  console.log('reqGetDrawer', req.params)
  drawerService.getActiveDrawerByTerminal(req.params.terminal)
  .then(drawer => res.json(drawer))
  .catch(err => next(err));
}

function getPrevDrawer (req, res, next) {
  console.log('reqGetPrevDrawer', req.params)
  drawerService.getPrevDrawer(req.params.terminal, req.params.timestamp)
    .then(response => {
      console.log('contrPrevDrawResp', response)
      res.json(response)
    })
    .catch(err => next(err))
}

/*
function getAll (req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getById (req, res, next) {
  const currentUser = req.user;
  const id = req.params.id;
  console.log('req', currentUser, id);

  // only allow admins to access other user records
  if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  userService.getById(req.params.id)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}
*/
