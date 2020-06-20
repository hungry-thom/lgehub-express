const express = require('express');
const router = express.Router();
const authorize = require('../../_helpers/authorize');
const Role = require('../../_helpers/role');
const vendorService = require('./vendor.service');

// routes
// router.post('/', authorize(), newEmployee); // public route
// router.get('/', authorize(), getEmployeeList);
// router.get('/', authorize(), getAll); // admin only use -> authorize(Role.Admin)
router.get('/getvendors', authorize(), getVendors);
module.exports = router;

function getVendors (req, res, next) {
  vendorService.getVendors()
  .then(vendorList => {
    res.json(vendorList)
  })
  .catch(err => {
    console.log('getVendorsError', err)
    next(err)
  });
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
