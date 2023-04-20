const app = require('express');
const router = app.Router();
const utility = require('../utility');
const registeredUserModel = require('../model/registeredUserModel');

router.get('/checkUserNameValid/:checkValue', utility.isLoggedIn, async function (req, res, next) {
    const checkValue = req.params.checkValue;
    try {
        const userNameExist = await registeredUserModel.findOne({ userName: checkValue });
        if (!userNameExist) {
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }

});

router.get('/saveUserName/:userName', utility.isLoggedIn, async function (req, res, next) {
    const valueToSave = req.params.userName;
    // checking if the userName is already used by someone
    try {
        const userNameObject = await registeredUserModel.findOne({ userName: valueToSave });
        if (userNameObject) {
            res.status(500).send();
        } else {
            // it means the userName is not used by anyone
            const userObject = await registeredUserModel.findOne({ id: req.user.id });
            userObject.userName = valueToSave;
            await userObject.save();
            // saving the username in session Object
            req.session.passport.user.userName = valueToSave;
            res.status(200).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;