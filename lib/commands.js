const vorpal = require('vorpal')();
const chalk = vorpal.chalk;

vorpal.delimiter(chalk.magenta('unificli>')).show();

require('./cmd-locations')(vorpal); // Register the cmd command

vorpal.show().parse(process.argv);
module.exports = vorpal;