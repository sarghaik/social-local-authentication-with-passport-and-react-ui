
const passport = require('passport')
	, User = require('../models/user')
	, GoogleStrategy = require('passport-google-oauth2').Strategy;


module.exports = {
	setStrategy: (req, res, next) => {
		passport.use(new GoogleStrategy({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL
			},
			function(accessToken, refreshToken, profile, done) {
				console.log(profile);
				process.nextTick(function() {
					//need to change user to profile in future
					User.findOne({email: profile.emails[0].value}, function(err, user) {

						if(err) {
							console.log(err);  // handle errors!
						}
						if (!err && user !== null) {
							user.google = profile._json;
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
								firstname: profile.name.givenName,
								lastname: profile.name.familyName,
								role: 'guser',
								mobile: '-',
								provider: 'google',
								google: profile._json
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