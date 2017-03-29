# UNIFICli
Experimental CLI based on node-unifiapi allowing remote CLI access to Ubiquiti Unifi REST API commands over direct HTTPS session or via Unifi Cloud, to Ubiquiti Controller / Ubiquioti Cloud Key.

## Warning! Still under development!
This product is under development and comes without any support!
Any help will is appreciated!

## Installation
To install this application, you have to do:

    git clone https://github.com/delian/unificli.git
    cd unificli
    npm install

### XOpenDisplay Error
A frequent error caused by node-webrtc module is the one defined in issue [#281](https://github.com/js-platform/node-webrtc/issues/281)

    node: symbol lookup error: [local-path]/build/wrtc/v0.0.61/Release/node-v47-linux-x64/wrtc.node: undefined symbol: XOpenDisplay

It happens mostly on Linux, almost exquisively if the Linux have X11 subsystem, although it is not caused directly by it (but a bad linking).
The easiest method to avoid it is to use non desktop (non X11 based) Linux distribution, like Ubuntu Server. We all hope that in version 0.0.62 of the node-webrtc module this issue will be fixed.

## Starting
You can start the application with this:

    npm start

## Usage
The CLI is (based on vorpal) REPL.
You type commands and they are executed on the chosen Ubiquiti Unifi System.

### Inline help
Using commands **help** or *<command>* *--help* in the cli provides us with small inline help

### Prompt
The CLI Prompt is either **unificli** or it is formatted like that:

**current location name:site name>** for HTTP locations

**current location name:site name:device id>** for Cloud based locations.


### Locations
In order to connect (or specify controller where the commands will be send to) you need to create a location.
The location is basically a URL/Authentication methods for connection to the controller.

Each location have one of the following parameters:

| Param | Optional | Description |
| --- | --- | --- |
| name | mandatory | Unique identifier of the location used as internal reference |
| type | optional | It is either http (default) or cloud. Http means direct http access. Cloud means access trough Ubiquiti cloud and WebRTC |
| url | optional | If type is http, this is the URL to the Ubiquiti Controller. Default is https://127.0.0.1:8443 |
| username | optional | Username for authentication to the URL (type http) or to Unifi Cloud (type cloud). Default ubnt |
| password | optional | Password for authentication. Default ubnt |
| deviceId | optional | Only if we have type cloud, specifies the Cloud's unique Device ID of the Controller |

To create location use:

    add location <Name of the Location>

Where we have the following options:

    unificli> add location --help
    
      Missing required argument. Showing Help:
    
      Usage: add location [options] <name>
    
      Add a new location

      Options:
    
        --help                     output usage information
        -t, --type <type>          Type of access to the Unifi key. Could be http (default) or cloud
        -U, --url <url>            Url of access. If not specified, defaults apply
        -u, --username <username>  Username for authentication
        -p, --password <password>  Password for authentication
        -d, --deviceid <deviceId>  Device ID in case of cloud access. If not specified, the first in the device list is default

To remove location use:

    delete location <Name of the Location>

To edit location use:

    edit location <Name of the Location>

Where the options are:

    unificli> edit location --help

    Missing required argument. Showing Help:

    Usage: edit location [options] <name>

    Modify location

    Options:

        --help                     output usage information
        -t, --type <type>          Type of access to the Unifi key. Could be http (default) or cloud
        -U, --url <url>            Url of access. If not specified, defaults apply
        -u, --username <username>  Username for authentication
        -p, --password <password>  Password for authentication
        -d, --deviceId <deviceId>  Device ID in case of cloud access. If not specified, the first in the device list is default

To select default current location use:

    set location <name of the location>

Or you could use the simplest:

    cd <name of the location>

To display the locations use:

    show locations

Almosy all of the Ubiquiti calls require Site name. Within the Ubiquiti controller you could group devices into groups named sites and they share configurations that are applied per site or per device per site. Therefore in which site you belong must always be known.

To select a different site use:

    set site <site name>

If you use location that is cloud based, all commands need to know the ID of the registered controller they are supposed to be executed (available options are visible with **show controllers**).
You could select different controller device id by using the command:

    set deviceId <deviceId>

### Commands

The following commands are available (please call **<command> --help** in order to see their options):

list_guests [options]                List all registered guests

list_clients [options]               List all registered clients

stat_client [options]                Client statistics

list_self [options]                  Get information about yourself

stat_sysinfo [options]               Get System info

list_wlan_groups [options]           Get Wlan Groups

list_usergroup [options]             Get User Groups

list_health [options]                Get Health Status

list_dashboard [options]             Get Dashboards

list_users [options]                 Get Users

list_aps [options]                   Get Access Points

list_rogueaps [options]              Get Rogue Access Points

list_networkconf [options]           Get network configuration

list_sites [options]                 Get Sites

stat_sites [options]                 Site stats

stat_voucher [options]               Voucher stats

stat_payment [options]               Payment stats

list_hotspot [options]               Hotspot list

list_portforwarding [options]        Portforwarding list

list_dynamicdns [options]            Dynamic DNS list

list_portconf [options]              Port configuration list

list_extension [options]             Extensions list

list_settings [options]              Settings list

list_events [options]                Events list

list_alarms [options]                Alarms list

status [options]                     Get current status

stat_sdn [options]                   SDN stats

