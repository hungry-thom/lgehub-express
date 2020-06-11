const express = require('express');
const router = express.Router();
const authorize = require('../../_helpers/authorize');
const Role = require('../../_helpers/role');
const deliveryService = require('./delivery.service');

// routes
router.post('/', saveDelivery); // public route
// router.post('/', authorize(), saveDelivery); // public route
// router.get('/', authorize(), getDeliveryList);
// router.get('/deliverydates', authorize(), getDeliveryDates);
router.get('/deliverydates', getDeliveryDates);
router.get('/', getDeliveryList);
// router.get('/', authorize(), getAll); // admin only use -> authorize(Role.Admin)
module.exports = router;

function getDeliveryDates (req, res, next) {
  console.log('--getDeliveryDates')
  deliveryService.getDeliveryDates()
  .then(deliveryDates => {
    res.json(deliveryDates)
    console.log('---respDeliveryDates')
  })
  .catch(err => {
    console.log('--respDeliveryDatesError', err)
  })
}

function getDeliveryList (req, res, next) {
  console.log('---getDeliveryList', req.query)
  // res.send({msg: 'yes!'})
  deliveryService.getDeliveryList(req.query.date)
  .then(deliveryList => {
    res.json(deliveryList)
    console.log('---respDeliveryList', deliveryList)
  })
  .catch(err => {
    console.log('---respDeliveryListError', err)
  })
}

function saveDelivery (req, res, next) {
  console.log('body', req.body);
  deliveryService.saveDelivery(req.body)
    .then(resp => {
      res.json(resp)
      console.log(resp)
    })
    .catch(err => {
      console.log('nextError', err)
     next(err)
    })
}
