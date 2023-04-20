const registeredUserModel = require('../model/registeredUserModel');

module.exports = {
    saveNewUser: async function (req, res, next) {
        if (req.user) {
            try {
                const userId = req.user.id;
                const userObject = await registeredUserModel.findOne({ id: userId });
                if (!userObject) {
                    const saveObject = {
                        displayName: req.user.displayName,
                        firstName: req.user.given_name,
                        lastName: req.user.family_name,
                        email: req.user.email,
                        picture: req.user.picture,
                        emailList: req.user.emails,
                        pictureList: req.user.photos,
                        id: userId
                    }
                    await new registeredUserModel(saveObject).save();
                } else {
                    // if it is returning user
                    req.session.passport.user.userName = userObject.userName;
                }
            } catch (error) {
                console.log(error);
            }
            next();
        } else {
            req.logout();
            req.session.destroy();
            res.clearCookie('connect.sid', { path: '/' }).status(500).send("Some error occurred");
        }
    },
}