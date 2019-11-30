const express = require('express');
const router = express.Router();
const drawerService = require('./drawer.service.js');
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

// routes
// router.get('/', authorize(Role.Admin), getAll); // admin only
router.post('/open', authorize(), createSession);
router.get('/:terminal/', authorize(), getDrawer);
module.exports = router;

function createSession (req, res, next) {
  console.log('reqCreateSession', req.body)
  sessionService.createSession(req.body)
    .then(createdSession => res.json(createdSession))
    .catch(err => next(err));
}

function getDrawer (req, res, next) {
  console.log('reqGetDrawer')
  drawerService.getDrawer(req.params.terminal)
  .then(drawer => res.json(drawer))
  .catch(err => next(err));
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
