const express = require("express");
const route = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', route);

module.exports = app;