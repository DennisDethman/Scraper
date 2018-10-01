//dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

//initialize Express app
const express = require('express');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(process.cwd() + '/public'));

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Mongoose!')
});

const routes = require('./controller/controller.js');
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('Listening on PORT ' + port);
});