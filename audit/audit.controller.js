const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');
const auditService = require('./audit.service');

// routes
// router.post('/', authorize(), newEmployee); // public route
// router.get('/', authorize(), getEmployeeList);
// router.get('/', authorize(), getAll); // admin only use -> authorize(Role.Admin)
router.get('/', authorize(), getEmployeeList);
module.exports = router;

function getTagList (req, res, next) {
  console.log('---getTagList')
  auditService.getTagList(req.)
  .then(tagList => {
    res.json(tagList)
    console.log('---respTagList', tagList)
  })
  .catch(err => {
    console.log('---respTagListError', err)
  })
}

/*
function newEmployee (req, res, next) {
  console.log('body', req.body);
  employeeService.newEmployee(req.body)
    .then(resp => {
      res.json(resp)
      console.log(resp)
    })
    .catch(err => {
      console.log('nextError', err)
     next(err)
    });
}

function getEmployeeList (req, res, next) {
  console.log('---getEmployeeList')
  employeeService.getEmployeeList()
  .then(empList => {
    res.json(empList)
    console.log('---respEmpList', empList)
  })
  .catch(err => {
    console.log('---respEmpListError', err)
  })
}
*/
