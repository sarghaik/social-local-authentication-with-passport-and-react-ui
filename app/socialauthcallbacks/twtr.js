
const passport = require('passport')
	, User = require('../models/user')
	, TwitterStrategy = require('passport-twitter').Strategy;


module.exports = {
	setStrategy: (req, res, next) => {
		passport.use(new TwitterStrategy({
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: process.env.TWITTER_CALLBACK_URL
			},
			function(accessToken, refreshToken, profile, done) {
				console.log(accessToken);
					console.log(refreshToken);
					console.log(profile);
				process.nextTick(function() {
					//need to change user to profile in future

					User.findOne({email: profile.emails[0].value}, function(err, user) {

						if(err) {
							console.log(err);  // handle errors!
						}
						if (!err && user !== null) {
							user.twitter = profile._json;
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
								role: 'guser',
								mobile: '-',
								provider: 'twitter',
								twitter: profile._json
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