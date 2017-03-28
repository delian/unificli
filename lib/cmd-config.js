const config = require('./config');
const vorpal = require('./vorpal');

module.exports = function() {
    vorpal.command('show config', 'Show configuration')
        .action(function(args, cb) {
            this.log(config);
            cb();
        });
};