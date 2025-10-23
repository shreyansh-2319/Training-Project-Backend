const passport = require('passport');

/**
 * Middleware to check if the user is authenticated via JWT.
 * Attaches the authenticated user object to req.user.
 */
exports.authenticateJWT = (req, res, next) => {
    // This is the function that actually runs the Passport strategy
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

