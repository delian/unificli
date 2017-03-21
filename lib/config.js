var config = require('../config.json');
var defaultConfig = require('./defaultConfig.json');
var merge = require('merge');

var cnf = merge(defaultConfig, config);

if (cnf.debug) {
    require('debug').enable('unificli:*');
}

module.exports = cnf;