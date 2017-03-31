var config = require('./config');
var vorpal = require('./vorpal');
var getLocation = require('./getLocation');
var loc = require('./locations');

module.exports = function () {

    function addCmd(cmd, descr, callback) {
        return vorpal.command(cmd, descr)
            .option('-l, --location <location>', 'Location')
            //        .option('-d, --deviceId <deviceId>', 'Cloud Device Id')
            .option('-s, --site <site>', 'Site')
            .action(function (args, cb) {
                getLocation(args.options.location, data => {
                    if (!data) return cb();
                    let unifi = loc.unifi(data);
                    callback.call(this, unifi, args, cb);
                });
            });
    }

    addCmd('show controllers', 'Show registered controllers in this cloud account', function (unifi, args, cb) {
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
        })
        .option('-o, --online', 'Display only online controllers')
        .option('-O, --offline', 'Display only offline controllers');

    addCmd('delete controller <name>', 'Delete controller from the cloud', function (unifi, args, cb) {
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

    addCmd('list_guests', 'List all registered guests', function (unifi, args, cb) {
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
        .option('-h, --historyhours <historyhours>', 'How many hours back. Default 8670');

    addCmd('list_clients', 'List all registered clients', function (unifi, args, cb) {
            unifi.unifi.list_clients(args.options.mac ? args.options.mac.toLowerCase() : undefined, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-m, --mac <mac>', 'Client Mac Address');

    addCmd('stat_client', 'Client statistics', function (unifi, args, cb) {
            unifi.unifi.stat_client(args.options.mac ? args.options.mac.toLowerCase() : undefined, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-m, --mac <mac>', 'Client Mac Address');

    addCmd('list_self', 'Get information about yourself', function (unifi, args, cb) {
        unifi.unifi.list_self(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('stat_sysinfo', 'Get System info', function (unifi, args, cb) {
        unifi.unifi.stat_sysinfo(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_wlan_groups', 'Get Wlan Groups', function (unifi, args, cb) {
        unifi.unifi.list_wlan_groups(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_usergroup', 'Get User Groups', function (unifi, args, cb) {
        unifi.unifi.list_usergroup(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_health', 'Get Health Status', function (unifi, args, cb) {
        unifi.unifi.list_health(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_dashboard', 'Get Dashboards', function (unifi, args, cb) {
        unifi.unifi.list_dashboard(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_users', 'Get Users', function (unifi, args, cb) {
        unifi.unifi.list_users(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_aps', 'Get Access Points', function (unifi, args, cb) {
            unifi.unifi.list_aps(args.options.mac ? args.options.mac.toLowerCase() : undefined, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-m, --mac <mac>', 'AP MAC address');

    addCmd('list_rogueaps', 'Get Rogue Access Points', function (unifi, args, cb) {
            unifi.unifi.list_aps(args.options.within, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-w, --within <within>', 'How many hours back. Default 24');

    addCmd('list_networkconf', 'Get network configuration', function (unifi, args, cb) {
        unifi.unifi.list_networkconf(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_sites', 'Get Sites', function (unifi, args, cb) {
        unifi.unifi.list_sites()
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('stat_sites', 'Site stats', function (unifi, args, cb) {
        unifi.unifi.list_sites()
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('stat_voucher', 'Voucher stats', function (unifi, args, cb) {
            unifi.unifi.stat_voucher(parseInt((new Date(args.options.createtime)).getTime() / 1000), args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-c, --createtime <createtime>', 'Since when');

    addCmd('stat_payment', 'Payment stats', function (unifi, args, cb) {
            unifi.unifi.stat_payment(parseInt((new Date(args.options.createtime)).getTime() / 1000), args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-c, --createtime <createtime>', 'Since when');

    addCmd('list_hotspot', 'Hotspot list', function (unifi, args, cb) {
        unifi.unifi.list_hotspot2(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_portforwarding', 'Portforwarding list', function (unifi, args, cb) {
        unifi.unifi.list_portforwarding(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_dynamicdns', 'Dynamic DNS list', function (unifi, args, cb) {
        unifi.unifi.list_dynamicdns(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_portconf', 'Port configuration list', function (unifi, args, cb) {
        unifi.unifi.list_portconf(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_extension', 'Extensions list', function (unifi, args, cb) {
        unifi.unifi.list_extension(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_settings', 'Settings list', function (unifi, args, cb) {
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
        .alias('get_settings');

    addCmd('list_events', 'Events list', function (unifi, args, cb) {
        unifi.unifi.list_events(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('list_alarms', 'Alarms list', function (unifi, args, cb) {
        unifi.unifi.list_alarms(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('status', 'Get current status', function (unifi, args, cb) {
        unifi.unifi.status(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('stat_sdn', 'SDN stats', function (unifi, args, cb) {
        unifi.unifi.sdn_stat(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('authorize_guest <mac>', 'Authorize Guest', function (unifi, args, cb) {
            unifi.unifi.authorize_guest(args.mac.toLowerCase(), args.options.minutes, args.options.up, args.options.down, args.options.mbytes, args.options.apmac, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-m, --minutes <minutes>', 'For how long in minutes. Default 60')
        .option('-u, --up <up>', 'Upstream rate limit in Kbps. Default none')
        .option('-d, --down <down>', 'Downstream rate limit in Kbps. Default none')
        .option('-b, --mbytes <mbytes>', 'Download limit in Mbytes')
        .option('-a, --apmac <apmac>', 'Authorize to this AP MAC');

    addCmd('unauthorize_guest <mac>', 'Deauthorize Guest', function (unifi, args, cb) {
        unifi.unifi.unauthorize_guest(args.mac.toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('kick_sta <mac>', 'Kick station off the network', function (unifi, args, cb) {
        unifi.unifi.kick_sta(args.mac.toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('terminate_guest <id>', 'Terminate guest authorization', function (unifi, args, cb) {
        unifi.unifi.terminate_guest(args.id, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('block_sta <mac>', 'Block station off the network', function (unifi, args, cb) {
        unifi.unifi.block_sta((args.mac||'').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('unblock_sta <mac>', 'Unblock station off the network', function (unifi, args, cb) {
        unifi.unifi.unblock_sta((args.mac||'').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('set_sta_note <id> [note]', 'Set note to a station', function(unifi, args, cb) {
        unifi.unifi.set_sta_note(args.id, args.note, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    });

    addCmd('set_sta_name <id> [name]', 'Set note to a station', function(unifi, args, cb) {
        unifi.unifi.set_sta_name(args.id, args.note, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    });

    addCmd('stat_sessions', 'Session stats', function(unifi, args, cb) {
        unifi.unifi.stat_sessions(args.options.begin, args.options.end, args.options.type, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-b, --begin <begin>', 'Begin of the period. Unix timestamp')
        .option('-e, --end <end>', 'End of the period. Unix timestamp')
        .option('-t, --type <type>', 'Type. Default all', ['all']);

    addCmd('stat_daily_site', 'Daily site stats', function(unifi, args, cb) {
        unifi.unifi.stat_daily_site(args.options.begin, args.options.end, undefined, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-b, --begin <begin>', 'Begin of the period. Unix timestamp')
        .option('-e, --end <end>', 'End of the period. Unix timestamp');

    addCmd('stat_hourly_site', 'Hourly site stats', function(unifi, args, cb) {
        unifi.unifi.stat_hourly_site(args.options.begin, args.options.end, undefined, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-b, --begin <begin>', 'Begin of the period. Unix timestamp')
        .option('-e, --end <end>', 'End of the period. Unix timestamp');

    addCmd('stat_hourly_ap', 'Hourly ap stats', function(unifi, args, cb) {
        unifi.unifi.stat_hourly_site(args.options.begin, args.options.end, undefined, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-b, --begin <begin>', 'Begin of the period. Unix timestamp')
        .option('-e, --end <end>', 'End of the period. Unix timestamp');

    addCmd('stat_sta_sessions_latest [mac]', 'Last sessions per station stats', function(unifi, args, cb) {
        unifi.unifi.stat_sta_sessions_latest(args.mac, args.options.limit, undefined, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-l, --limit <limit>', 'How many sessions max. Default 5');

    addCmd('stat_auths', 'Authentication stats', function(unifi, args, cb) {
        unifi.unifi.stat_auths(args.options.begin, args.options.end, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-b, --begin <begin>', 'Begin of the period. Unix timestamp')
        .option('-e, --end <end>', 'End of the period. Unix timestamp');

    addCmd('stat_allusers', 'All user stats', function(unifi, args, cb) {
        unifi.unifi.stat_allusers(args.options.historyhours, args.options.type, args.options.conn, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });        
    })
        .option('-t, --type <type>', 'Type', ['all'])
        .option('-c, --conn <conn>', 'Connections', ['all'])
        .option('-h, --historyhours <historyhours>', 'How many hours back. Default 8670');


};