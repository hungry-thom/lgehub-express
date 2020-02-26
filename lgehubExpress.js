// require('rootpath')();
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./_helpers/error-handler');
var app = express();
global.config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/transactions', require('./transactions/transactions.controller'));
app.use('/drawers', require('./drawers/drawers.controller'));
app.use('/inventory', require('./inventory/inventory.controller'));
app.use('/employees', require('./employees/employees.controller'));
app.use('/customers', require('./customers/customers.controller'));
app.use('/deliveries', require('./deliveries/deliveries.controller'));

// global error handler
app.use(errorHandler);


app.listen(config.port, function() {
	console.log("Listening on port: " + config.port);
});
