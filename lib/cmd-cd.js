module.exports = function(vorpal) {
    const chalk = vorpal.chalk;
    let cd = vorpal.command('cd [location]', 'Change location')
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
            cd.autocomplete(['tralala']);
        });
};