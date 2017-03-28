var locations = require('./db')('locations');
var vorpal = require('./vorpal');
var loc = require('./locations');

module.exports = function(name, cb) {
    let locId = name || loc.getCurrentLoc()._id;
    if (!locId) {
        vorpal.log('ERROR: No location specified');
        return cb();
    }
    locations.findOne({ $or: [{ name: locId }, { _id: locId }] }, (err, data) => {
        if (err || (!data)) {
            vorpal.log('ERROR: No such location', locId);
            return cb();
        }
        cb(data);
    });
};