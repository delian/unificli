let locations = require('./db')('locations');
let mbus = require('./mbus');
let debug = require('debug')('unificli:cmd-locations');
const config = require('./config');

module.exports = function(vorpal) {
    const chalk = vorpal.chalk;

    // ***** CD location
    let loc = [];
    let cmd_cd = vorpal.command('cd [location]', 'Change location')
        .autocomplete(['.', '..'])
        .action(function(args, cb) {
            let location = args.location;
            if (typeof location == 'undefined' || location == '..') {
                vorpal.delimiter(chalk.magenta(config.prompt + '>'));
                return cb();
            }
            if (location == '.') {
                return cb();
            }

            if (loc.indexOf(location) < 0) {
                this.log('ERROR: No such location');
                return cb();
            }

            vorpal.delimiter(chalk.magenta(`${config.prompt}:${location}>`));
            cb();
        });

    mbus('locations').on('change', () => {
        debug('Update locations');
        locations.find({}, (err, data) => {
            if (err || (!data)) return;
            loc = data.map(n => n.name);
            loc = loc.concat(data.map(n => n._id), '.', '..');
            cmd_cd.autocomplete(loc);
        });
    });

    mbus('locations').emit('change');
    //setInterval(() => mbus('locations').emit('update'), 5000); // Evey 5 seconds read again

    // ***** Show Locations
    let cmd_show_loc = vorpal.command('show locations', 'Show all known locations')
        .action(function(args, cb) {
            locations.find({}, (err, data) => {
                if (err) {
                    this.log('ERROR', err);
                    return cb();
                }
                data.forEach(n => {
                    this.log('name:', n.name, '(', n._id, ') url:', n.url || '<default>', 'username:', n.username || '<default>', 'password:', n.password || '<default>', 'deviceId:', n.deviceId || '<none>');
                })
                cb();
            });
        });

    let cmd_add_loc = vorpal.command('add location <name>', 'Add a new location')
        .option('-t, --type <type>', 'Type of access to the Unifi key. Could be http (default) or cloud', ['http', 'cloud'])
        .option('-U, --url <url>', 'Url of access. If not specified, defaults apply')
        .option('-u, --user <username>', 'Username for authentication')
        .option('-p, --pass <password>', 'Password for authentication')
        .option('-d, --deviceid <deviceId>', 'Device ID in case of cloud access. If not specified, the first in the device list is default')
        .action(function(args, cb) {
            //this.log('Location add', args);
            locations.insert({
                type: args.options.type || 'http',
                name: args.name,
                username: args.options.username || '',
                password: args.options.password || '',
                deviceId: args.options.deviceId || ''
            }, (err, data) => {
                if (err) {
                    this.log('ERROR: Cannot add this location', err);
                    return cb();
                }
                this.log('Location added.');
                mbus('locations').emit('update', 'add', args.name);
                mbus('locations').emit('change', 'add', args.name);
                return cb();
            })
        });

    // let cmd_del_loc = vorpal.command('delete location <name>', 'Delete location')
}