const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser, createUser } = require('../repository/user');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const emailExist = await fetchUser.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const phoneExist = await fetchUser.findOne({ phone });
        if (phoneExist) {
            return res.status(400).json({ error: "Phone number already in use" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await createUser({ name, email, password: hashedPassword, phone });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await fetchUser({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const generatedToken = jwt.sign(
            { 
                id: user._id 
            },
             process.env.TOKEN, { expiresIn: '7d' }
        );
        const result = {
            id: user._id,
            email: user.email,
            token: generatedToken,
        };
    
        return res.status(200).json({ result });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
