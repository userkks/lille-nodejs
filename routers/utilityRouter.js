const app = require('express');
const router = app.Router();

router.use('/saveData', require('./saveDataRouter'));       // for normal api creation
router.use('/checkApiValid', require('./checkApiValidRouter'));
router.use('/blogPost', require('./blogPostRouter'));
router.use('/login', require('./loginRouter'));
router.use('/getProfile', require('./getProfileRouter'));
router.use('/userName', require('./userNameRouter'));
router.use('/userApi', require('./userApiRouter'));

module.exports = router;