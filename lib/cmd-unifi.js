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
        })
        .alias('self');

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
        .option('-c, --createtime <createtime>', 'Since when')
        .alias('list_voucher');

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
        })
        .alias('sdn_stat');

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
        unifi.unifi.block_sta((args.mac || '').toLowerCase(), args.options.site || loc.getCurrentSite())
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
        unifi.unifi.unblock_sta((args.mac || '').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('set_sta_note <id> [note]', 'Set note to a station', function (unifi, args, cb) {
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

    addCmd('set_sta_name <id> [name]', 'Set note to a station', function (unifi, args, cb) {
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

    addCmd('stat_sessions', 'Session stats', function (unifi, args, cb) {
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

    addCmd('stat_daily_site', 'Daily site stats', function (unifi, args, cb) {
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

    addCmd('stat_hourly_site', 'Hourly site stats', function (unifi, args, cb) {
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

    addCmd('stat_hourly_ap', 'Hourly ap stats', function (unifi, args, cb) {
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

    addCmd('stat_sta_sessions_latest [mac]', 'Last sessions per station stats', function (unifi, args, cb) {
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

    addCmd('stat_auths', 'Authentication stats', function (unifi, args, cb) {
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

    addCmd('stat_allusers', 'All user stats', function (unifi, args, cb) {
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

    addCmd('add_site <name> [description]', 'Add new site', function (unifi, args, cb) {
        unifi.unifi.add_site(args.name, args.description || '', args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('remove_site <name>', 'Remove site', function (unifi, args, cb) {
        unifi.unifi.remove_site(args.name, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('create_hotspot <name> [password]', 'Create new hotspot', function (unifi, args, cb) {
            unifi.unifi.create_hotspot(args.name, args.password || '', args.options.note || '', args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-n, --note <note>', 'Note');

    addCmd('create_vouchers <count>', 'Create new vouchers', function (unifi, args, cb) {
            unifi.unifi.create_voucher(args.count, args.options.minutes, args.options.quota, args.options.note, args.options.up, args.options.down, args.options.mbytes, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-n, --note <note>', 'Vouchers note')
        .option('-u, --up <up>', 'Upstream bandwidth limit in kbps')
        .option('-d, --down <down>', 'Downstream bandwidth limit in kbps. Default no limit')
        .option('-b, --mbytes <mbytes>', 'Download limit in MBs. Default no limit')
        .option('-e, --expire <expire>', 'Expire in how many minutes. Default 60')
        .option('-q, --quota <quota>', 'How many logins with this voucher. Defaul 0 = no limit');

    addCmd('revoke_voucher <id>', 'Revoke voucher', function (unifi, args, cb) {
        unifi.unifi.revoke_voucher(args.id, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('restart_ap <mac>', 'Restart AP', function (unifi, args, cb) {
        unifi.unifi.restart_ap((args.mac || '').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('disable_ap <id>', 'Disable AP', function (unifi, args, cb) {
            unifi.unifi.disable_ap(args.id, (typeof args.options.disable == 'undefined') ? true : (args.options.disable == 'true'), args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-d, --disable <disable>', 'To disable or enable AP. Default is true = disable', ['true', 'false']);

    addCmd('enable_ap <id>', 'Enable AP', function (unifi, args, cb) {
            unifi.unifi.enable_ap(args.id, (typeof args.options.disable == 'undefined') ? false : (args.options.disable == 'true'), args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-d, --disable <disable>', 'To disable or enable AP. Default is false = enable', ['true', 'false']);

    addCmd('set_locate_ap <mac>', 'Locate AP mark', function (unifi, args, cb) {
        unifi.unifi.set_locate_ap((args.mac || '').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('unset_locate_ap <mac>', 'Locate AP mark removal', function (unifi, args, cb) {
        unifi.unifi.unset_locate_ap((args.mac || '').toLowerCase(), args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('site_ledson', 'Turn LEDs on per site', function (unifi, args, cb) {
        unifi.unifi.set_ledson(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('site_ledsoff', 'Turn LEDs off per site', function (unifi, args, cb) {
        unifi.unifi.set_ledson(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('get_settings_by_key <key>', 'Retrieve only the settings under that key', function (unifi, args, cb) {
            unifi.unifi.get_settings_by_key(args.key, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .autocomplete(['connectivity', 'country', 'locale', 'mgmt', 'guest_access', 'dpi', 'super_identity', 'super_mgmt', 'super_sdn']);

    addCmd('set_settings_by_key <key> <property> <value>', 'Set value to property under a key', function (unifi, args, cb) {
            let o = {};
            o[args.property] = args.value;
            unifi.unifi.set_settings(args.key, o, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .autocomplete(['connectivity', 'country', 'locale', 'mgmt', 'guest_access', 'dpi', 'super_identity', 'super_mgmt', 'super_sdn']);

    addCmd('rename_ap <id> [name]', 'Rename AP', function (unifi, args, cb) {
        unifi.unifi.rename_ap(args.id, args.name || '', args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('extend_voucher <id>', 'Extend Voucher', function (unifi, args, cb) {
        unifi.unifi.extend_voucher(args.id, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('sdn_onoff', 'Enable/Disable SDN (default disable)', function (unifi, args, cb) {
            unifi.unifi.sdn_onoff(args.options.enable ? true : false, args.options.site || loc.getCurrentSite())
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-e, --enable', 'Enable SDN');

    addCmd('sdn_register <username> <password>', 'Register to Unifi Cloud', function (unifi, args, cb) {
        unifi.unifi.sdn_register(args.username, args.password, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('sdn_unregister', 'Deregister from Unifi Cloud', function (unifi, args, cb) {
        unifi.unifi.sdn_unregister(args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('remove_wlanconf <id>', 'Remove Wlan Configuration', function (unifi, args, cb) {
        unifi.unifi.remove_wlanconf(args.id, args.options.site || loc.getCurrentSite())
            .then(data => {
                data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                cb();
            })
            .catch(err => {
                this.log('ERROR', err);
                cb();
            });
    });

    addCmd('add_wlanconf <name>', 'Add Wlan Configuration', function (unifi, args, cb) {
            unifi.unifi.add_wlanconf(
                    args.name,
                    args.options.guest ? true : false,
                    args.options.usergroup,
                    args.options.wlangroup,
                    args.options.security || 'open',
                    args.options.disabled ? false : true,
                    args.options.dtim_mode || 'default',
                    args.options.dtim_na || 1,
                    args.options.dtim_ng || 1,
                    args.options.mac_filter_enabled || false,
                    args.options.mac_filter ? ((args.options.mac_filter instanceof Array) ? args.options.mac_filter : [args.options.mac_filter]) : [],
                    args.options.mac_filter_policy || 'deny',
                    args.options.radius_port || 1812,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    args.options.site || loc.getCurrentSite()
                )
                .then(data => {
                    data.data.forEach(n => this.log(JSON.stringify(n, null, 4)));
                    cb();
                })
                .catch(err => {
                    this.log('ERROR', err);
                    cb();
                });
        })
        .option('-g, --guest', 'Do we apply the Guest settings. Default false')
        .option('-e, --security <security>', 'What security is enabled. Default open', ['open', 'wpa-psk', 'wep'])
        .option('-u, --usergroup <usergroup>', 'Usergroup ID')
        .option('-w, --wlangroup <wlangroup>', 'Wlangroup ID')
        .option('--disabled', 'Disabled? Default is enabled')
        .option('--dtim_mode <dtim_mode>', 'DTIM mode', ['default'])
        .option('--dtim_na <dtim_na>', 'DTIM NA, default is 1', ['1'])
        .option('--dtim_ng <dtim_ng>', 'DTIM NG, default is 1', ['1'])
        .option('--mac_filter_enabled', 'Enable Mac Filter')
        .option('--mac_filter <mac_filter>', 'Mac Filter. Could be multiple times, and contains allowed/denied mac addresses. Depends on the policy. Default is empty')
        .option('--mac_filter_policy <mac_filter_policy>', 'Mac Filter Policy. Default deny', ['permit', 'deny'])
        .option('--radius_port <radius_port>', 'Radius port. Default 1812');


    addCmd('debug [debug]', 'Enable or disable debug', function (unifi, args, cb) {
            this.log('Debugging for this location is', args.debug ? 'enabled' : 'disabled');
            unifi.obj.debugging(args.debug == 'disable' ? false : true);
            cb();
        })
        .autocomplete(['enable', 'disable']);

    addCmd('connectSSH <mac>', 'Open SSH Session to a device via WebRTC', function (unifi, args, cb) {
            let ssh = unifi.unifi.connectSSH(
                args.mac,
                args.options.uuid,
                args.options.stun,
                args.options.turn,
                args.options.user,
                args.options.pass,
                args.options.site || loc.getCurrentSite(),
                args.options.autoclose || 40000
            );
            this.log('Trying to connect to', args.mac, '...');

            let sshData = null;
            process.stdin.setEncoding('utf8');
            let write = setInterval(() => {
                process.stdout.write(sshData ? sshData.recv() : '');
            }, 30);
            let readableSSH = () => {
                let chunk = process.stdin.read();
                if (chunk != null && sshData) sshData.send(chunk);
                process.stdout.write(sshData ? sshData.recv() : '');
            };
            let closeSSH = () => {
                this.log('INPUT closed. Clossing session');
                process.stdin.removeListener('end', closeSSH);
                process.stdin.removeListener('readable', readableSSH);
                sshData && sshData.close().then(() => cb()).catch(err => {
                    this.log('ERROR', err);
                    cb();
                })
            };

            ssh.connect(args.options.timeout || 100000, closeSSH)
                .then(data => {
                    this.log('Connection is Open!');
                    sshData = data;
                    process.stdout.write(data.recv());
                    process.stdin.on('end', closeSSH);
                    process.stdin.on('readable', readableSSH);
                }).catch(err => {
                    this.log('ERROR', err);
                    cb();
                })
        })
        .option('-u, --uuid <uuid>', 'UUID for the session. If undefined, random is generated')
        .option('--stun <stun>', 'STUN Server')
        .option('--turn <turn>', 'TURN Server')
        .option('--user <user>', 'TURN Username')
        .option('--pass <pass>', 'TURN Password')
        .option('--autoclose <autoclose>', 'How many ms to wait without input, before auto closing the session. 40000 is default');

    addCmd('test', 'Just a test', function (unifi, args, cb) {
            this.log('We got', args, args.options);
            cb();
        })
        .option('-a, --a <a>', 'AAAA')
        .option('--pesho <pesho>', 'Pesho', function (input, cb) {
            cb(['1', '2', '3'])
        });

};