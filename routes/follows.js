const express = require('express');
const { followUser, unfollowUser, getFollowers, getMutualFollowers } = require('../controllers/followC');
const { userAuthenticate } = require('../middleware/authentication');

const followRoute = express.Router();

followRoute.post('/follow', userAuthenticate, followUser);
followRoute.delete('/unfollow/:user_id', userAuthenticate, unfollowUser);
followRoute.get('/followers/:user_id', userAuthenticate, getFollowers);
followRoute.get('/mutual-followers/:user1_id/:user2_id', userAuthenticate, getMutualFollowers);

module.exports = followRoute;
