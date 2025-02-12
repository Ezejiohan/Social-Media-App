const Follow = require('../models/follow');

exports.followUser = async (options) => {
    return await Follow.create(options)
};

exports.followUserAndDelete = async (options) => {
    return await Follow.findByIdAndDelete(options)
};

exports.follow = async (options) => {
    return await Follow.find(options)
};
