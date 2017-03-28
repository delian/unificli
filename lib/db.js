let debug = require('debug')('unificli:db');
let config = require('./config');
let Datastore = require('nedb');
let mbus = require('./mbus');

class DbMy {
    constructor(name) {
        this.name = name;
        this.db = new Datastore({
            filename: config.db.filename + '.' + name,
            autoload: true
        })
    }

    emit(name, obj) {
        setTimeout(() => {
            mbus(this.name).emit(name, obj);
            mbus(this.name).emit('change', obj, name);
        }, 100);
    }

//*
    find(query, cb) {
        this.db.find(query, cb);
    }

    findOne(query, cb) {
        this.db.findOne(query, cb);
    }

    update(query, cb) {
        this.db.update(query, cb);
        this.emit('update', query);
    }

    insert(record, cb) {
        this.db.insert(record, cb);
        this.emit('insert', record);
    }

    remove(query, cb) {
        this.db.remove(query, cb);
        this.emit('remove', query);
    }
    // */
}

debug('Database module is loaded');

let DBIndex = {};

function DBOpen(name) {
    if (DBIndex[name]) return DBIndex[name];
    return DBIndex[name] = new DbMy(name);
}

module.exports = DBOpen;