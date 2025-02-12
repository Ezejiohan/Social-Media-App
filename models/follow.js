const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    following_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true });

followSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

const Follow = mongoose.model('follows', followSchema);
module.exports = Follow;
