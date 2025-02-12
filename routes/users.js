const express = require('express');
const { signup, login, verifyUser, resetPassword } = require('../controllers/userC');

const route = express.Router();

route.post('/signup', signup);
route.post('/login', login);
route.get('/verifyUser/:userId', verifyUser);
route.patch('/resetPassword/:userId/:token', resetPassword);

module.exports = route;
