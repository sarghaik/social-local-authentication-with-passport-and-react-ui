const jwtVerify = require('../util/jwt').jwtVerify;

module.exports = (options) => {

    var validator =  (user) => {return false};
    if (options.role) {
        validator = (user) => {
            return user.role === options.role;
        }
    }

    return (req, resp, next) => {

        let token = req.headers['x-auth-token'] || req.body.t || req.query.t;
        if (!token) {
            return resp.status(400).send({error: 'Bad Request'}) ;
        }
        jwtVerify(token, function (err, data) {

            if (err) {
                return resp.status(401).send({error: 'Unauthorized'}) ;
            }

            let granted = validator(data, req.method, req.path);
            if (granted) {
                req.user = data;
                next();
            }
            else {
                resp.status(403).send({error: 'Forbidden'});
            }
        })
    }
};