const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');

passport.use(new googleStrategy({
    clientID:  keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: keys.GOOGLE_AUTH_CALLBACK,
    passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});