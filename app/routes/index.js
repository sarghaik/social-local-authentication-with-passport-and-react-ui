const express   = require('express')
    , router    = express.Router()
    , passport = require('passport')
    , authorize = require('../middleware/authorization')
    , userController  = require('../controllers/userController')
    , fbController   = require('../socialauthcallbacks/fb')
    , twtrController   = require('../socialauthcallbacks/twtr')
    , googleController   = require('../socialauthcallbacks/google')
    , linkedinController   = require('../socialauthcallbacks/linkedin');

//local api
router.route('/usr/local')
    .post(userController.createLocalUser, userController.sendToken);

router.route('/auth/login')
    .post(userController.login, userController.sendToken);

router.route('/auth/resetpassword').post(authorize({role: "guser"}), userController.resetPassword);

router.route('/auth/generatepasswordlink').get(userController.generatePasswordLink);

router.route('/singleuser').get(userController.getSingleUser);

fbController.setStrategy();
twtrController.setStrategy();
googleController.setStrategy();
linkedinController.setStrategy();

// fb api
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook'), userController.sendToken);

// twtr api
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter'), userController.sendToken);

// google api
router.get('/auth/google', passport.authenticate('google', { scope : 'email' }));
router.get('/auth/google/callback', passport.authenticate('google'), userController.sendToken);


// linkedin api
router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin'), userController.sendToken);

module.exports = router;
