const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
//var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('req-flash');
// import routes
const customerRoutes = require("./routes/api/customers");
const serviceProviderRoutes = require("./routes/api/service_provider");
const renderRouters = require("./routes/renderRoutes");
const uploadsDocs = require("./routes/uploadsDocs");
const spRoutes = require("./routes/spRoutes");


const app = express();




// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));
// routes middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
//Passport middleware
app.use(passport.initialize());

//passport Config
const myPassportService = require("./config/passport")(passport);

app.use(session({
  secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    //path: "/",
    //domain: 'example.com'
    secure: false
  },
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.name = req.session.name;
  res.locals.email = req.session.email;
  next();
});

app.use(function (req, res, next) {
  res.locals.messages = req.flash();
  next();
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public/'))); // configure express to use public folder

app.use(cookieParser('keyboard cat'))

app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


app.use("/api", customerRoutes); //create three seprate api like buyerCustomerRouts,SellerCustomerRouts,renovator customerRoutes
app.use("/api", serviceProviderRoutes);
app.use("/", renderRouters);
app.use("/", uploadsDocs);
app.use('/', spRoutes);

app.get('/', (req, res) => res.render('index'));



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
