const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser, createUser, fetchUserById, fetchUserByIdAndUpdate } = require('../repository/user');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const emailExist = await fetchUser({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const phoneExist = await fetchUser({ phone });
        if (phoneExist) {
            return res.status(400).json({ error: "Phone number already in use" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await createUser({ 
            name, 
            email, 
            password: hashedPassword, 
            phone 
        });
        await user.save();

        res.status(201).json({ message: "User registered successfully", data: user });

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
                userId: user._id 
            },
             process.env.TOKEN, { expiresIn: '7d' }
        );
        const result = {
            userId: user._id,
            email: user.email,
            token: generatedToken,
        };
    
        return res.status(200).json({ result });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await fetchUserById(userId);
        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        if (user.is_verified === true) {
            return res.status(400).json({ message: "User already Verified" });
        }

        const newUser = await fetchUserByIdAndUpdate(userId, {is_verified: true}, {new: true});
        res.status(200).json({newUser});
    } catch (error) {
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await fetchUser({ email: req.body.email });
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.TOKEN, {expiresIn: '30mins'})

        const passwordChangeLink = `${req.protocol}://${req.get("host")}/user/resetPassword/${user._id}/${token}`;
        const message = `Click this link: ${passwordChangeLink} to set a new password`;

        sendEmail({
            email: user.email,
            subject: 'Forget password link',
            message: message
        });

        res.status(200).json({
            message: "Email has sent"
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending reset link", error: error.message });
    }
};    

exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const token = req.params.token

    // Find user by ID
    const user = await fetchUserById(req.params.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    // Verify the token
    await jwt.verify(token, process.env.TOKEN)
    
    // Check if the new password matches the confirmation
    if (newPassword !== confirmPassword) {
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
    }

    // Hash the new password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    // Update the user's password
    const updatePassword = await fetchUserByIdAndUpdate(req.params.userId, {
        password: hashPassword
    });

    await user.save();

    res.status(200).json({updatePassword})
    } catch (error) {
        res.status(500).json({ message: "Password reset failed", error: error.message });
    }
}
