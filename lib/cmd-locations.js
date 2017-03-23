let locations = require('./db')('locations');

module.exports = function(vorpal) {
    const chalk = vorpal.chalk;
    let loc = [];
    let cmd = vorpal.command('cd [location]', 'Change location')
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

    function fixLocations() {
        locations.find({}, (err, data) => {
            if (err || (!data)) return;
            loc = data.map(n => n.name);
            loc.concat(data.map(n => n._id));
            loc.concat(['pesho']);
            cmd.autocomplete(loc);
        });
    }

    fixLocations();
    setInterval(fixLocations, 500); // Every 500ms update the locations
};