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


    vorpal.command('list_guests', 'List all registered guests')
        .option('-h, --historyhours <historyhours>', 'How many hours back. Default 8670')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_guests(args.options.historyhours, args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_clients', 'List all registered clients')
        .option('-m, --mac <mac>', 'Client Mac Address')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_clients(args.options.mac ? args.options.mac.toLowerCase():undefined, args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_client', 'Client statistics')
        .option('-m, --mac <mac>', 'Client Mac Address')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.stat_client(args.options.mac ? args.options.mac.toLowerCase():undefined, args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_self', 'Get information about yourself')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_self(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_sysinfo', 'Get System info')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.stat_sysinfo(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_wlan_groups', 'Get Wlan Groups')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_wlan_groups(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_usergroup', 'Get User Groups')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_usergroup(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_health', 'Get Health Status')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_health(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_dashboard', 'Get Dashboards')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_dashboard(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_users', 'Get Users')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_users(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_aps', 'Get Access Points')
        .option('-m, --mac <mac>', 'AP MAC address')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_aps(args.options.mac?args.options.mac.toLowerCase():undefined,args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_rogueaps', 'Get Rogue Access Points')
        .option('-w, --within <within>', 'How many hours back. Default 24')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_aps(args.options.within,args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_networkconf', 'Get network configuration')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_networkconf(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_sites', 'Get Sites')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_sites()
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_sites', 'Site stats')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_sites()
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_voucher', 'Voucher stats')
        .option('-c, --createtime <createtime>', 'Since when')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.stat_voucher(parseInt((new Date(args.options.createtime)).getTime()/1000),args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_payment', 'Payment stats')
        .option('-c, --createtime <createtime>', 'Since when')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.stat_payment(parseInt((new Date(args.options.createtime)).getTime()/1000),args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_hotspot', 'Hotspot list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_hotspot2(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_portforwarding', 'Portforwarding list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_portforwarding(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_dynamicdns', 'Dynamic DNS list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_dynamicdns(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_portconf', 'Port configuration list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_portconf(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_extension', 'Extensions list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_extension(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_settings', 'Settings list')
        .alias('get_settings')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_settings(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_events', 'Events list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_events(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('list_alarms', 'Alarms list')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.list_alarms(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });
        
    vorpal.command('status', 'Get current status')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.status(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

    vorpal.command('stat_sdn', 'SDN stats')
        .option('-l, --location <location>', 'Location')
//        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
        .option('-s, --site <site>', 'Site')
        .action(function(args, cb) {
            getLocation(args.options.location, data => {
                if (!data) return cb();
                let unifi = loc.unifi(data);
                unifi.unifi.sdn_stat(args.options.site || loc.getCurrentSite())
                    .then(data => {
                        data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                        cb();
                    })
                    .catch(err => {
                        this.log('ERROR', err);
                        cb();
                    });
            })
        });

};