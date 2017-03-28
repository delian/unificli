const vorpal = require('vorpal')();
const chalk = vorpal.chalk;
const config = require('./config');

vorpal.use(require('vorpal-less'));
vorpal.use(require('vorpal-grep'));
vorpal.use(require('vorpal-comment'), { command: '//', alias: ['#', '!'] });
vorpal.history('unificli');
vorpal.delimiter(chalk.magenta(config.prompt + '>')).show();

require('./cmd-locations')(vorpal); // Register the cmd command

vorpal.show().parse(process.argv);
module.exports = vorpal;