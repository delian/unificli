const config = require('./config');
const mbus = require('./mbus');
const cloud = require('node-unifiapi/cloudapi');
const unifi = require('node-unifiapi');
const vorpal = require('./vorpal');
const chalk = vorpal.chalk;

let l = {};
let location = '';

mbus('locations').on('change', function () {
    // We have to reset the locations
    vorpal.log('Change happened on locations, reset all sessions');
    l = {};
})

module.exports = {
    unifi: function (loc) { // LOC is the ID
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
                deviceId: loc.deviceId
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
    },
    getCurrent: function() {
        return location;
    },
    setCurrent: function(name) {
        location = name;
        if (location) {
            vorpal.delimiter(chalk.magenta(`${config.prompt}:${location}>`));
        } else {
            vorpal.delimiter(chalk.magenta(`${config.prompt}>`));            
        }
    }
}