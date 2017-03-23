let locations = require('./db')('locations');
let mbus = require('./mbus');
let debug = require('debug')('unificli:cmd-locations');

module.exports = function(vorpal) {
    const chalk = vorpal.chalk;
    let loc = [];
    let cmd = vorpal.command('cd [location]', 'Change location')
        .autocomplete(['.', '..'])
        .action(function(args, cb) {
            let location = args.location;
            if (typeof location == 'undefined' || location == '..') {
                vorpal.delimiter(chalk.magenta(`unificli>`));
                return cb();
            }
            if (location == '.') {
                return cb();
            }

            if (loc.indexOf(location) < 0) {
                this.log('ERROR: No such location');
                return cb();
            }

            vorpal.delimiter(chalk.magenta(`unificli:${location}>`));
            cb();
        });

    mbus('locations').on('change', () => {
        debug('Update locations');
        locations.find({}, (err, data) => {
            if (err || (!data)) return;
            loc = data.map(n => n.name);
            loc = loc.concat(data.map(n => n._id), '.', '..');
            cmd.autocomplete(loc);
        });
    });

    mbus('locations').emit('change');
    setInterval(() => mbus('locations').emit('update'), 5000); // Evey 5 seconds read again
};