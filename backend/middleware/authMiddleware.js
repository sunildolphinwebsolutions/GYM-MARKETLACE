const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    try {
        // Bearer <token>
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        // Verify against secret key
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

const isGymOwner = (req, res, next) => {
    if (req.user && req.user.role === 'gym_owner') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Access denied. Gym Owners only.' });
    }
};



module.exports = {
    verifyToken,
    isGymOwner
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    isGymOwner,
    checkRole
};
