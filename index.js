require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');

const { db } = require('./lib/db');

// routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const Recipe = require('./models/Recipe');

const app = express();

// register view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// session
const pgPool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
});

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
  store: new pgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),
};
app.use(session(sessionConfig));

// passport auth
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(passport.session());

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { ...user.dataValues, password: null });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

// register flash after session
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.infoMessage = req.flash('infoMessage');

  next();
});

// homepage route
app.get('/', async (req, res) => {
  const recipes = await Recipe.findAll({
    where: { public: true },
    order: [['createdAt', 'DESC']],
  });

  res.render('index', { recipes });
});

// routes
app.use(authRoutes);
app.use(userRoutes);
app.use(recipeRoutes);

// general 404 for all other routes
app.use((req, res) => {
  res.status(404).render('404');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Not Found', 500));
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
