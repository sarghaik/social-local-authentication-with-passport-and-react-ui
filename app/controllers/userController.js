const User = require('../models/user')
    , jwtEncrypt = require('../util/jwt').jwtEncrypt
    , sendEmail = require('../util/emails').sendEmail;

module.exports = {
    getSingleUser: (req, res, next) => {
        let userid = req.query.userid;
        if(!userid) return res.status(500).send(err);
        User.findOne({_id: userid}, (err, user)=> {
            if (err) return res.status(500).send(err);
            res.send(user);
        });
    }
    , createLocalUser: (req, res, next) => {
        let user = new User(req.body);
        user.role = 'guser';
        user.mobile = '-';
        user.provider = 'local';
        user.save((err, usr) => {
            if (err) return res.status(500).send(err);
            req.user = usr;
            next();
        });
    }
    , resetPassword: (req, res, next) => {
        User.findOne({_id: req.user._id}, (err, user)=> {
            user.password = req.body.password;
            user.save((err, usr) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(usr);
            });
        });
    }
    , generatePasswordLink: (req, res, next) => {
        User.findOne({email: req.query.email}, (err, user) => {
            user = user.toObject();
            var jwt = {
                _id: user._id,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                provider: user.provider
            };

            jwtEncrypt(jwt)
            .then((err, token, exp) => res.send({token: token, exp: exp}));
        });
    }
    , login: (req, res, next) => {
        let {email, password: pwd} = req.body;

        User.findOne({email: email})
            .select('email mobile role salt hashed_password')
            .exec((err, user) => {

            if (err) return res.status(500).send({error: err});

            if (user && user.authenticate(pwd)) {
                req.user = user
                next();
            }
            else {
                res.status(500).send({error: "invalid username/password"});
            }
        });
    }
    , sendToken: (req, res, next)=>{
        user = req.user.toObject();
        var jwt = {
            _id: user._id,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            fullname: user.fullname,
            provider: user.provider
        };

        jwtEncrypt(jwt).then((token, exp) => res.status(200).send({token: token, exp: exp}));
    }
}