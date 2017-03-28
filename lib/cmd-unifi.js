var config = require('./config');
var vorpal = require('./vorpal');
var getLocation = require('./getLocation');
var loc = require('./locations');

module.exports = function() {
    vorpal.command('show controllers', 'Show registered controllers in this cloud account')
        .option('-l, --location <location>', 'Set location')
        .option('-o, --online', 'Display only online controllers')
        .option('-O, --offline', 'Display only offline controllers')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();

                let unifi = loc.unifi(data);
                unifi.obj.devices()
                    .then(data => {
                        let devices = data.devices.filter(
                            n => (args.options.online && n.online == true) ||
                            (args.options.offline && n.online == false) ||
                            ((!args.options.online) && (!args.options.offline))
                        );
                        devices.forEach(n => {
                            this.log(JSON.stringify(n, null, 4));
                        });
                        cb();
                    })
                    .catch(err => {
                        this.log('Error', err);
                        cb();
                    });
            });
        });

    vorpal.command('delete controller <name>', 'Delete controller from the cloud')
        .option('-l, --location <location>')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();

                let unifi = loc.unifi(data);
                unifi.obj.devices()
                    .then(data => {
                        let device = data.devices.filter(n => n._id == args.name || n.name == args.name || n.device_id == args.name || n.hostname == args.name).shift();
                        if (!device) {
                            this.log('ERROR: No such controller exist', args.name);
                            return cb();
                        }
                        this.log('Delete controller', device);
                        cb();
                    })
                    .catch(err => {
                        this.log('Error', err);
                        cb();
                    });
            });
        });
};