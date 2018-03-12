const mongoose = require('mongoose')
    , crypto = require('crypto')
    , Schema = mongoose.Schema;

/**
 * User Schema
 */

const UserSchema = new Schema({
    email: {
        type: String,
        validate: {
            isAsync: true,
            validator: function (email, fn) {
                const User = mongoose.model('User');
                // Check only when it is a new user or when email field is modified
                if (this.isNew || this.isModified('email')) {
                    User.find({ email: email }).exec(function (err, users) {
                        fn(!err && users.length === 0);
                    });
                } else fn(true);
            },
            message: 'Email {VALUE} already exists!'
        },
        required: [true, 'Email cannot be blank']
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    mobileverified: {},
    role: {
        type: String,
        "enum" : ['system', 'admin', 'guser']
    },
    hashed_password: {
        type: String,
        required: function () {
            if(this.provider!="local") {
                return false;
            }
            return this.hashed_password.length;// && this._password.length;
        },
        message: 'Password cannot be blank'
    },
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    provider: {
        type: String,
        required: [true, 'Provider cannot be blank']
    },
    facebook: {},
    twitter: {},
    google: {},
    linkedin: {}
});

const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    if(!this.createdAt) {
        this.createdAt = new Date();
    }
    this.fullname = this.firstname + ' ' + this.lastname;
    if (!this.isNew) return next();

    if(this.provider!="local") return next();

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }

};

module.exports = mongoose.model('User', UserSchema);
