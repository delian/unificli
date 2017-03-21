let debug = require('debug')('unificli:db');
let config = require('./config');
let Datastore = require('nedb');

debug('Database module is loaded');

let DBIndex = {};

function DBOpen(name) {
    if (DBIndex[name]) return DBIndex[name];
    let db = new Datastore({
        filename: config.db.filename + '.' + name,
        autoload: true
    });
    DBIndex[name] = db;
    return db;
}

module.exports = DBOpen;