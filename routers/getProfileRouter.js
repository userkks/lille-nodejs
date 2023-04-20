const app = require('express');
const router = app.Router();

router.get('/', function(req, res, next) {
    if (req.user) {
        const profile = {
            name: req.user.displayName,
            email: req.user.email,
            userName: req.user.userName
        }
        res.json(profile);
    } else {
        res.json(null);
    }
});

module.exports = router;