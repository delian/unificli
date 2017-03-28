// Locations
var locations = require('./db')('locations');
var mbus = require('./mbus');
var debug = require('debug')('unificli:cmd-locations');
var config = require('./config');
var vorpal = require('./vorpal');
var loc = require('./locations');

module.exports = function() {
    const chalk = vorpal.chalk;

    function locationsComplete(cb) {
        locations.find({}, (err, data) => {
            let loc = [];
            if (err || (!data)) return cb(loc);
            cb(loc.concat(data.map(n => n.name), data.map(n => n._id)));
        });
    }

    // ***** CD location
    vorpal.command('cd [location]', 'Change location')
        .autocomplete(function(input, cb) {
            locationsComplete((data) => cb(data.concat(['.', '..'])))
        })
        .action(function(args, cb) {
            let location = args.location;
            if (typeof location == 'undefined' || location == '..') {
                loc.setCurrent('');
                return cb();
            }
            if (location == '.') {
                return cb();
            }

            locations.findOne({
                $or: [{
                    name: args.location
                }, {
                    _id: args.location
                }]
            }, (err, data) => {
                if (err || (!data)) {
                    this.log('ERROR: No such location', args.location);
                    return cb();
                }
                loc.setCurrent(data.name);
                this.log('Location changed to', data.name);
                cb();
            });
        });

    // ***** Show Locations
    vorpal.command('show locations', 'Show all known locations')
        .action(function(args, cb) {
            locations.find({}, (err, data) => {
                if (err) {
                    vorpal.log('ERROR', err);
                    return cb();
                }
                data.forEach(n => {
                    vorpal.log('name:', n.name, '(', n._id, ') type:', n.type || 'http', 'url:', n.url || '<default>', 'username:', n.username || '<default>', 'password:', n.password || '<default>', 'deviceId:', n.deviceId || '<none>');
                });
                cb();
            });
        });

    vorpal.command('show location [name]', 'Show particular location')
        .autocomplete((input, cb) => locationsComplete(cb))
        .action(function(args, cb) {
            if (!args.name) {
                cb();
                return vorpal.exec('show locations'); // TODO: find a solution for the cb conflict
            } else
                locations.findOne({
                    $or: [{
                        name: args.name
                    }, {
                        _id: args.name
                    }]
                }, (err, data) => {
                    if (err || (!data)) {
                        this.log('ERROR: No such location', args.name, err || '');
                        return cb();
                    }
                    this.log('name:', data.name, '(', data._id, ') type:', data.type || 'http', 'url:', data.url || '<default>', 'username:', data.username || '<default>', 'password:', data.password || '<default>', 'deviceId:', data.deviceId || '<none>');
                    cb();
                });
        });

    vorpal.command('add location <name>', 'Add a new location')
        .option('-t, --type <type>', 'Type of access to the Unifi key. Could be http (default) or cloud', ['http', 'cloud'])
        .option('-U, --url <url>', 'Url of access. If not specified, defaults apply')
        .option('-u, --user <username>', 'Username for authentication')
        .option('-p, --pass <password>', 'Password for authentication')
        .option('-d, --deviceid <deviceId>', 'Device ID in case of cloud access. If not specified, the first in the device list is default')
        .action(function(args, cb) {
            //this.log('Location add', args);
            locations.insert({
                type: args.options.type || '',
                name: args.name,
                username: args.options.username || '',
                password: args.options.password || '',
                deviceId: args.options.deviceId || ''
            }, (err, data) => {
                if (err) {
                    this.log('ERROR: Cannot add this location', err);
                    return cb();
                }
                this.log('Location added', args.name);
                cb();
            });
        });

    vorpal.command('delete location <name>', 'Delete location')
        .autocomplete((input, cb) => locationsComplete(cb))
        .action(function(args, cb) {
            locations.remove({
                $or: [{
                    name: args.name
                }, {
                    _id: args.name
                }]
            }, (err, data) => {
                if (err || (!data)) {
                    this.log('ERROR: No location name or id ', args.name);
                    return cb();
                }
                this.log('Location', args.name, 'removed');
                cb();
            });
        });

    vorpal.command('edit location <name>', 'Modify location')
        .option('-t, --type <type>', 'Type of access to the Unifi key. Could be http (default) or cloud', ['http', 'cloud'])
        .option('-U, --url <url>', 'Url of access. If not specified, defaults apply')
        .option('-u, --user <username>', 'Username for authentication')
        .option('-p, --pass <password>', 'Password for authentication')
        .option('-d, --deviceid <deviceId>', 'Device ID in case of cloud access. If not specified, the first in the device list is default')
        .autocomplete((input, cb) => locationsComplete(cb))
        .action(function(args, cb) {
            let o = {};
            ['type', 'url', 'username', 'password', 'deviceId'].forEach(n => { if (args.options.hasOwnProperty(n)) o[n] = args.options[n]; });
            locations.update({ $or: [{ name: args.name }, { _id: args.name }] }, { $set: o }, (err, data) => {
                if (err || (!data)) {
                    this.log('ERROR: No such location', args.name);
                    return cb();
                }
                this.log('Location', args.name, 'updated');
                cb();
            });
        });
}