const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { db } = require('./utils/db');

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

// homepage route
app.get('/', (req, res) => {
  res.send('Homepage here');
});

// routes
app.use(authRoutes);

// general 404 for all other routes
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
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
