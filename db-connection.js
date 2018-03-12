
module.exports = function (url) {

    const PromiseLib = require('bluebird')
        , mongoose = require('mongoose');
    mongoose.Promise = PromiseLib;
    mongoose.useMongoClient = true;

    //db options
    let options = {
        server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
        replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
        promiseLibrary: PromiseLib
    };

    //db connection
    mongoose.connect(url, options);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    return function () {
        mongoose.disconnect()
    }
}