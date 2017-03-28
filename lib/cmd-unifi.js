var config = require('./config');
var vorpal = require('./vorpal');
var getLocation = require('./getLocation');
var loc = require('./locations');

module.exports = function() {
    vorpal.command('show controllers', 'Show registered controllers in this cloud account')
        .option('-l, --location <location>')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();

                let unifi = loc.unifi(data);
                unifi.obj.devices()
                    .then(data => {
                        data.devices && data.devices.forEach(n => {
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
                        let device = data.devices.filter(n => n._id == args.name || n.name == args.name).shift();
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