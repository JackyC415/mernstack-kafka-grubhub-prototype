const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require('body-parser');
const User = require("./models/User");
const kafka = require('./kafka/client')
const PORT = process.env.PORT || 3001;

/*
const corsPrefetch = require("cors-prefetch-middleware");
const imagesUpload = require("images-upload-middleware");

app.use('/static', express.static('./server/static'));
app.use(corsPrefetch);
 
app.post('/notmultiple', imagesUpload(
    './server/static/files',
    'http://localhost:3001/static/files'
));
*/

//cross origin resources sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//use express session to maintain session data
app.use(session({
  secret: 'cmpe273_lab2_secret',
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000
}));

//connect to mongoDB through mongoose schema model
mongoose.connect('mongodb://localhost:27017/lab2', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

//Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

//initialize routes path
const { login, register, getProfile, updateProfile, logOut } = require('./routes/user');
const { getRestaurants, orderItem, viewCart, viewSearchItems, filterByCuisine, messageOwner, viewReply } = require('./routes/buyer');
const { getItemToEdit, getOwnerMenu, updateItem, removeItem, saveItem, getBreakfastMenu, getLunchMenu, getAppetizerMenu, viewMessages, replyBuyer } = require('./routes/owner');

//GET api
app.get('/getProfile', getProfile);
app.get('/getOwnerMenu', getOwnerMenu);
app.get('/getItemToEdit/:id', getItemToEdit);
app.get('/getBreakfastMenu', getBreakfastMenu);
app.get('/getLunchMenu', getLunchMenu);
app.get('/getAppetizerMenu', getAppetizerMenu);
app.get('/viewCart', viewCart);
app.get('/viewSearchItems', viewSearchItems);
app.get('/viewMessages', viewMessages);
app.get('/viewReply', viewReply);

//POST api
app.post('/login', login);
app.post('/register', register);
app.post('/updateProfile', updateProfile);
app.post('/logOut', logOut);
app.post('/updateItem', updateItem);
app.post('/saveItem', saveItem);
app.post('/orderItem/:id', orderItem);
app.post('/getRestaurants', getRestaurants);
app.post('/filterByCuisine', filterByCuisine);
app.post('/messageOwner', messageOwner);
app.post('/replyBuyer', replyBuyer);

//DELETE api
app.delete('/removeItem/:id', removeItem);

module.exports = app;
app.listen(PORT, () => console.log('Server listening on port:', PORT));