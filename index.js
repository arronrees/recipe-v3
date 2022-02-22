const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { db } = require('./utils/db');

const app = express();

// register view engine
app.set('view-engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

// run server
db.authenticate()
  .then(() => {
    console.log('DB connected');

    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  })
  .catch((err) => console.log(err));
