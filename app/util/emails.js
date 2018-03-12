const api_key = process.env.MAILGUN_API_KEY
    , domain = process.env.MAILGUN_DOMAIN
    , mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = {

    sendemail: (data) => {
        return new Promise((resolve, reject)=>{
            mailgun.messages().send(data, (error, body) =>{
                if(error) reject(error);
                else resolve(body); 
            });
        });
    }
};
