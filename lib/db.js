let debug = require('debug')('unificli:db');
let config = require('./config');
let Datastore = require('nedb');
let mbus = require('./mbus');

class DbMy extends Datastore {
    constructor(name) {
        super({
            filename: config.db.filename + '.' + name,
            autoload: true
        })
        this.name = name;
    }

    emit(name, obj) {
        setTimeout(() => {
            mbus(this.name).emit(name, obj);
            mbus(this.name).emit('change', obj, name);
        }, 100);
    }

//*
    update(a, b, c, d, e, f) {
        super.update(a, b, c, d, e, f);
        //this.emit('update');
    }

    insert(a, b, c, d, e, f) {
        super.insert(a, b, c, d, e, f);
        //this.emit('insert');
    }

    remove(a, b, c, d, e, f) {
        super.remove(a, b, c, d, e, f);
        //this.emit('remove');
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