var express = require('express');
var router = express.Router();

/**
* Frist route will handle the static html delivery
* Second route will handle the api calls
**/

router.get('/', function(req, res) {
  res.json({message: "Hello World"});
})

router.use('/user', require('./user'));

module.exports = router;
