const vorpal = require('vorpal')();
const chalk = vorpal.chalk;

vorpal.use(require('vorpal-less'));
vorpal.use(require('vorpal-grep'));
vorpal.use(require('vorpal-comment'), { command: '//', alias: ['#', '!'] });
vorpal.history('unificli');
vorpal.delimiter(chalk.magenta('unificli>')).show();

require('./cmd-locations')(vorpal); // Register the cmd command

vorpal.show().parse(process.argv);
module.exports = vorpal;