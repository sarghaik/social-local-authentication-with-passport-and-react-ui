
const passport = require('passport')
	, User = require('../models/user')
	, LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;


module.exports = {
	setStrategy: (req, res, next) => {
		let strategy = new LinkedinStrategy({
			clientID: process.env.LINKEDIN_CLIENT_ID,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
			callbackURL: process.env.LINKEDIN_CALLBACK_URL,
			scope: ['r_emailaddress', 'r_basicprofile']
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(function() {
					//need to change user to profile in future
					User.findOne({email: profile.emails[0].value}, function(err, user) {

						if(err) {
							console.log(err);  // handle errors!
						}
						if (!err && user !== null) {
							user.linkedin = profile._json;
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
								firstname: profile.firstName,
								lastname: profile.lastName,
								role: 'guser',
								mobile: '-',
								provider: 'linkedin',
								linkedin: profile._json
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
		);
	}
}