const vorpal = require('vorpal')();
const chalk = vorpal.chalk;

vorpal.delimiter(chalk.magenta('unificli>')).show();

vorpal.command('test', 'Test help').action(function(args, cb) {
    this.log('Test');
    cb();
});

vorpal.command('cd [location]', 'Change location')
    .autocomplete(['loc', 'pesho', 'test'])
    .action(function(args, cb) {
        let location = args.location;
        if (typeof location == 'undefined' || location == '..') {
            vorpal.delimiter(chalk.magenta(`unificli>`));
            return cb();
        }
        if (location == '.') {
            return cb();
        }
        vorpal.delimiter(chalk.magenta(`unificli:${location}>`));
        cb();
    });


vorpal.show().parse(process.argv);
module.exports = vorpal;