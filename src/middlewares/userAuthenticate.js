const passport = require('passport');

exports.authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            const message = info && info.message ? info.message : 'Invalid or expired token.';
            return res.status(401).json({ 
                message: `Authentication failed: ${message}`
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

