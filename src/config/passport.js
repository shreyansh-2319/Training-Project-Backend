const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userSchema'); 

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.JWT_SECRET; 

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await User.findOne({ email: jwt_payload.email }).select('-password');

                if (user) {
                    return done(null, user); 
                } else {
                    return done(null, false);
                }
            } catch (err) {
                console.error("Passport JWT Error:", err);
                return done(err, false);
            }
        })
    );
};