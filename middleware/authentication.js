const jwt = require('jsonwebtoken');
const { fetchUserById } = require('../repository/user');

exports.userAuthenticate = async (req, res, next) => {
    try { 
        const hasAuthorization = req.headers.authorization;
        if(!hasAuthorization) {
            return res.status(400).json({
                message: 'UnAuthorized'
            });
        }
    
        const token = hasAuthorization.split(' ') [1];

        const decodedToken = jwt.verify(token, process.env.TOKEN);
          
        const user = await fetchUserById(decodedToken.id);
    
        if (!user) { 
            return res.status(404).json({
                message: 'Authorization Failed: User not found'
            });
        }
    
        req.user = decodedToken;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({
                message: 'Session Timeout'
            });
        }
        res.status(500).json({
            error: error.message
        });
            
    }
};
