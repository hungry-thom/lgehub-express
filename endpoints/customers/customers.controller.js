const express = require('express');
const router = express.Router();
const authorize = require('../../_helpers/authorize');
const Role = require('../../_helpers/role');
const customerService = require('./customer.service');

// routes
// router.post('/', authorize(), newCustomer); // public route
// router.get('/', authorize(), getCustomerList);
// router.get('/deliverylist', authorize(), getDeliveryList);
router.post('/', newCustomer); // public route
router.get('/', getCustomerList);
router.get('/deliverylist',  getDeliveryList);
// router.get('/', authorize(), getAll); // admin only use -> authorize(Role.Admin)
module.exports = router;

function getDeliveryList (req, res, next) {
  console.log('---getDeliverylist')
  customerService.getDeliveryList()
  .then(deliveryList => {
    res.json(deliveryList)
    console.log('---respDeliveryList', deliveryList)
  })
  .catch(err => console.log('---respDeliveryListError', err))
}

function getCustomerList (req, res, next) {
  console.log('---getCustomerList')
  customerService.getCustomerList()
  .then(custList => {
    res.json(custList)
    console.log('---respCustList', custList)
  })
  .catch(err => {
    console.log('---respEmpListError', err)
  })
}

function newCustomer (req, res, next) {
  console.log('body', req.body);
  customerService.newCustomer(req.body)
    .then(resp => {
      res.json(resp)
      console.log(resp)
    })
    .catch(err => {
      console.log('nextError', err)
     next(err)
    });
}
