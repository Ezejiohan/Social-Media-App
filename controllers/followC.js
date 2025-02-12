const Follow = require('../models/follow');

exports.followUser = async (req, res) => {
    try {
        const { following_id } = req.body;
        const follower_id = req.user.userId;

        if (follower_id === following_id) return res.status(400).json({ error: "You cannot follow yourself" });

        await Follow.create({ follower_id, following_id });

        res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const follower_id = req.user.userId;

        await Follow.findOneAndDelete({ follower_id, following_id: user_id });

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const { user_id } = req.params;
        const followers = await Follow.find({ following_id: user_id }).populate('follower_id', 'name email');

        res.status(200).json({ followers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMutualFollowers = async (req, res) => {
    try {
        const { user1_id, user2_id } = req.params;

        const mutualFollowers = await Follow.find({
            follower_id: { $in: [user1_id, user2_id] },
            following_id: { $in: [user1_id, user2_id] }
        }).populate('follower_id', 'name email');

        res.status(200).json({ mutualFollowers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
