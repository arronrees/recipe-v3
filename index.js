require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const { db } = require('./lib/db');

// routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// register view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// session
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));

app.use((req, res, next) => {
  res.locals.user = req.session.user;

  next();
});

// homepage route
app.get('/', (req, res) => {
  res.render('index');
});

// routes
app.use(authRoutes);

// general 404 for all other routes
app.use((req, res) => {
  next(new ExpressError('Page Not Found', 404));
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);

  if (!err.message) err.message = 'Something went wrong...';

  res.status(err.status || 500).json({ error: true, message: err.message });
});

// run server
db.authenticate()
  .then(() => {
    console.log('DB connected');

    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  })
  .catch((err) => console.error(err));
