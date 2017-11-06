mongoose = require('mongoose');
var DB_CREDENTIALS = require('./keys/mongoDBCredentials.js')
var uri = 'mongodb://' + DB_CREDENTIALS
var local = 'mongodb://localhost' 

mongoose.Promise = global.Promise
// set to 'local' to run on localhost, uri to run on mLab
mongoose.connect(uri); 

var express = require('express'),
app = express();
bodyParser = require('body-parser');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('mongo server loaded')
})

port = process.env.PORT || 3000; 
app.listen(port);

// registering the routes and the model must happen before the routes
Users = require('./api/models/Model.js'); // registering the models.

routes = require('./api/routes/Routes.js'); //importing route

// boilerplate from HR sprint. Setting extended to true allows parsing of nested objects. 
app.use(bodyParser.urlencoded({extended: true}));
// sets the default parser to .json?
app.use(bodyParser.json());
routes(app); //register the route

console.log('betf listening on: ' + port);
