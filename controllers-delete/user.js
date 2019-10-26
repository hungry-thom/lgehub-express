var express = require('express');
var router = express.Router();
var db = require('../models/db');
var jwt = require('jsonwebtoken');

router.post('/', function (req, res) {
  // create new user
  var data = {
    email : req.body.emailAddress,
    password: req.body.password
  };
  var model = new db();
  model.addNewUser(data, function (error, response) {
    if (error) {
      return res.json({"error": true, "message": error})
    }
    res.json({"error": false, "message": "Added new user"});
  });
});

router.post('/login', function (req, res) {
  var model = new db();
  // perform user login
  model.findUser(req.body.emailAddress, function (error, response) {
    if (error) {
      return res.json({"error": true, "message": error)};
    }
    if (!response) {
      return res.json({"error": true, "message": error});
    }
    if (response.password !== req.body.password) {
      return res.json({"error": true, "message": "Password Mismatch"});
    }
    var token = jwt.sign(response, global.config.secret, {
      expiresIn: 1440 // expires in 1 hr
    });

    res.json({
      error: false,
      message: 'Validation successful!',
      token: token
    });
  });
});

module.exports = router;
