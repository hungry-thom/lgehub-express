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
app.use('/users', require('./endpoints/users/users.controller'));
app.use('/transactions', require('./endpoints/transactions/transactions.controller'));
app.use('/drawers', require('./endpoints/drawers/drawers.controller'));
app.use('/inventory', require('./endpoints/inventory/inventory.controller'));
app.use('/employees', require('./endpoints/employees/employees.controller'));
app.use('/customers', require('./endpoints/customers/customers.controller'));
app.use('/deliveries', require('./endpoints/deliveries/deliveries.controller'));
app.use('/expenses', require('./endpoints/expenses/expenses.controller'));

// global error handler
app.use(errorHandler);


app.listen(config.port, function() {
	console.log("Listening on port: " + config.port);
});
