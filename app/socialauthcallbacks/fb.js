
const passport = require('passport')
	, User = require('../models/user')
	, FacebookStrategy = require('passport-facebook').Strategy;


module.exports = {
	setStrategy: (req, res, next) => {
		passport.use(new FacebookStrategy({
			clientID: process.env.FACEBOOK_CLIENT_ID ,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK_URL,
			profileFields: ['id', 'emails', 'name']
			},
			(accessToken, refreshToken, profile, done) => {
				process.nextTick(function() {
					//need to change user to profile in future
					User.findOne({email: profile.emails[0].value}, function(err, user) {

						if(err) {
							console.log(err);  // handle errors!
						}
						if (!err && user !== null) {
							user.facebook = profile._json;
							process.nextTick(function() {
								user.save((error, usr) => {
									if (error) console.log(error);
				            		else {
										done(null, user);
									}
								});
							});
							done(null, user);
						} else {
							//need to change user save to profile save in future
							user = new User({
								email: profile.emails[0].value,
								firstname: profile.first_name,
								lastname: profile.last_name,
								role: 'guser',
								mobile: '-',
								provider: 'facebook',
								facebook: profile._json
							})
							user.save((error, usr) => {
			            		if (error) return console.log(error);
			            		else {
									done(null, user);
								}
					        });
					        done(null, user);
						}
					});
				});	
			}
		));
	}
}