const vorpal = require('vorpal')();
const chalk = vorpal.chalk;

vorpal.delimiter(chalk.magenta('unificli>')).show();

require('./cmd-cd')(vorpal);

vorpal.show().parse(process.argv);
module.exports = vorpal;