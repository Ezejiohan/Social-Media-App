const express = require("express");
const route = require('./routes/users');
const followRoute = require('./routes/follows');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', route);
app.use('/follows', followRoute);

module.exports = app;