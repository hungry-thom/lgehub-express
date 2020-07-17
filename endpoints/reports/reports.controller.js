const express = require('express');
const router = express.Router();
const authorize = require('../../_helpers/authorize');
const Role = require('../../_helpers/role');
const reportService = require('./report.service');

// routes
// router.post('/', authorize(), newEmployee); // public route
// router.get('/', authorize(), getEmployeeList);
// router.get('/', authorize(), getAll); // admin only use -> authorize(Role.Admin)
router.get('/getrevenue', authorize(), getRevenue);
router.get('/getpandl', authorize(), getPandL);
router.get('/monthly/:acct', authorize(), getMonthly);
module.exports = router;

function getMonthly (req, res, next) {
  // console.log('rec', req.params, req.query)
  reportService.getMonthly(req.params.acct, req.query)
  .then(resp => {
    // console.log('resp', resp)
    res.json(resp)
  })
  .catch(err => {
    console.log('getMonthlyError', err)
    // res.json(err)
  })
  /*
  res.json({ 'acct': req.params.acct, 'startDate': req.query.startDate, 'endDate': req.query.endDate, 'cat': req.query.cat })
  */
}

function getPandL (req, res, next) {
  reportService.getPandL(req.query.startDate, req.query.endDate)
  .then(resp => {
    res.json(resp)
  })
  .catch(err => {
    console.log('getPandLError', err)
  })
}

function getRevenue (req, res, next) {
  reportService.getRevenue(req.query.startDate, req.query.endDate)
  .then(resp => {
    res.json(resp)
  })
  .catch(err => {
    console.log('gerRevenueError', err)
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
