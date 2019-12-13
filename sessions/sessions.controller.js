const express = require('express');
const router = express.Router();
const sessionService = require('./session.service.js');
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

// routes
// router.get('/', authorize(Role.Admin), getAll); // admin only
router.post('/open', authorize(), openSession);
router.get('/items/', authorize(), getAllItems);
module.exports = router;

function openSession (req, res, next) {
  console.log('reqCreateSession', req.body)
  sessionService.openSession(req.body)
    .then(createdSession => res.json(createdSession))
    .catch(err => next(err));
}

function getAllItems (req, res, next) {
  console.log('reqAllItems')
  transactionService.getAllItems()
  .then(items => res.json(items))
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
