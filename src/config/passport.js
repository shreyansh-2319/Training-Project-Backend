const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userSchema'); 
// Options for the JWT strategy
const opts = {};

// 1. Tell the strategy where to find the JWT (e.g., in the Authorization header as 'Bearer <token>')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// 2. Secret key used to sign the JWT (must match the secret used in jwt.sign in loginStudent)
opts.secretOrKey = process.env.JWT_SECRET; 

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                // The jwt_payload contains the data you put in the token (studentId, email, role)
                // For robustness, find the user in the database to ensure the user still exists
                // and the role/status hasn't been revoked. 
                // We find by email for simplicity here, but studentId is better if you set it up.
                const user = await User.findOne({ email: jwt_payload.email }).select('-password');

                if (user) {
                    // Success! Pass the full user object (or just the payload) to req.user
                    return done(null, user); 
                } else {
                    // Token is valid but user no longer exists
                    return done(null, false);
                }
            } catch (err) {
                console.error("Passport JWT Error:", err);
                return done(err, false);
            }
        })
    );
};