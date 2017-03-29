const config = require('./config');
const mbus = require('./mbus');
const cloud = require('node-unifiapi/cloudapi');
const unifi = require('node-unifiapi');
const vorpal = require('./vorpal');
const chalk = vorpal.chalk;
const locations = require('./db')('locations');

let l = {};
let location = {};
let site = 'default';
let deviceId = '';

mbus('locations').on('change', function() {
    // We have to reset the locations
    vorpal.log('Change happened on locations, reset all sessions');
    l = {};
});

function locUnifi(loc) { // LOC is the ID
    if (l[loc._id]) return l[loc._id];

    let o = l[loc._id] = {
        obj: null,
        unifi: null,
        loc: loc
    };

    if (loc.type == 'cloud') {
        o.obj = cloud({
            username: loc.username,
            password: loc.password,
            deviceId: deviceId || loc.deviceId
        });
        o.unifi = o.obj.api;
    } else {
        o.obj = unifi({
            username: loc.username || 'ubnt',
            password: loc.password || 'ubnt',
            baseUrl: loc.url || 'https://127.0.0.1:8443'
        });
        o.unifi = o.obj;
    }

    return o;
}

function updatePrompt() {
    if (!location) {
        return vorpal.delimiter(chalk.magenta(`${config.prompt}`));
    }

    let s = location.name + ':' + (site ? site : '<select site>');

    if (location.type == 'cloud') {
        s = s + ':' + ((deviceId || location.deviceId) ? (deviceId || location.deviceId) : '<controller deviceId> ');
    }

    vorpal.delimiter(chalk.magenta(`${s}>`))
}

module.exports = {
    unifi: locUnifi,
    getCurrentName: function() {
        return location.name;
    },
    getCurrentLoc: function() {
        return location;
    },
    getCurrentUnifi: function() {
        return locUnifi(location);
    },
    setCurrentLoc: function(id) {
        if (!id) {
            location = '';
            return updatePrompt();
        }
        if (typeof id == 'string') {
            locations.findOne({ $or: [{ name: id }, { _id: id }] }, (err, data) => {
                if (err || (!data)) return;
                location = data;
                updatePrompt();
            });
        } else {
            location = id;
            updatePrompt();
        }
    },
    getCurrentSite: function() {
        return site;
    },
    setCurrentSite: function(id) {
        site = id || 'default';
        vorpal.log('Site has changed. We are resetting the session');
        delete l[location._id];
        updatePrompt();
    },
    getCurrentDeviceId: function() {
        return deviceId;
    },
    setCurrentDeviceId: function(id) {
        deviceId = id;
        vorpal.log('Device ID has changed. We are resetting the session');
        delete l[location._id];
        updatePrompt();
    }
};