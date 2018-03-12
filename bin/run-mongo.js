#!/usr/bin/env node

const spawn = require('child_process').spawn
    , HOME = require('os').homedir()
    , dbPath = HOME + "/Auth/db/data"
    , logPath = HOME + "/Auth/db/mongod.log"
    , mkdirs = require('mkdirp').sync
    , dirs = mkdirs(dbPath);
    
//
// Run mongod deamon
//
process.env.TEST_DB_URL = 'mongodb://localhost:27017';

const mongod = spawn('mongod', ["--dbpath", dbPath, "--logpath", logPath], {
    env: process.env,
    stdio: 'ignore'
}) ;

//
// Run the app
//
// spawn('node', [`${__dirname}/www`], {
//     env: process.env,
//     stdio: 'inherit'
// });