/*
 * Implements named messaging bus
 */

let EventEmitter = require('events');

let emitters = {};

class MsgBus extends EventEmitter {};

module.exports = function(name) {
    if (emitters[name]) return emitters[name];
    return emitters[name] = new MsgBus();
}