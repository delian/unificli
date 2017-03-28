const config = require('./config');

module.exports = function(vorpal) {
    vorpal.command('show config', 'Show configuration')
        .action(function(args, cb) {
            this.log(config);
            cb();
        });
};