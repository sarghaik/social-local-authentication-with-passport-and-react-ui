const jwt = require('jsonwebtoken')
    , SECRET_KEY = process.env.AUTH_LOCAL_KEY
    , KEY_EXPIRES = parseInt(process.env.KEY_EXPIRES)*3600*24
    , KEY_ISSUER = process.env.HOSTNAME || 'localhost';


module.exports = {

    jwtEncrypt: (obj) => {
        return new Promise((resolve, reject)=>{
            jwt.sign(obj, SECRET_KEY, {
                    expiresIn: KEY_EXPIRES,
                    algorithm: "HS256",
                    issuer: KEY_ISSUER
                }
                , (err, token)=>{
                    if(err) reject(err);
                    else resolve(token, Math.floor(Date.now() / 1000) + KEY_EXPIRES);
                });
        });
    },

    jwtVerify: (token) => {
        return new Promise((resolve, reject)=>{
            jwt.verify(token, SECRET_KEY,
                {
                    algorithms: ["HS256"],
                    clockTolerance: 10
                },
                resolve());
        });
    }
};