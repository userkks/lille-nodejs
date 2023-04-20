const app = require('express');
const router = app.Router();
const passport = require('passport');
const keys = require('../keys');
const newUserLogin = require('../middlewares/newUserLogin');

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/utility/login/redirectAfterLogin',
        failureRedirect: '/utility/login/redirectAfterLogin'
    })
);

router.get('/redirectAfterLogin', newUserLogin.saveNewUser, (req, res, next) => {
    res.send(`<script> window.opener.location.href='${keys.BASE_URL}/dashboard'; window.close();</script>`);
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie('connect.sid', {path: '/'}).status(200).send();
});

module.exports = router;