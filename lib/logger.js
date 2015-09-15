import Winston from 'winston';
import Chalk from 'chalk';
import Moment from 'moment';

const logger = new (Winston.Logger)({
    transports: [
        new (Winston.transports.Console)({
            timestamp: function() {
                return Chalk.bold(Moment().format('YYYY-MM-DD')) +
                       ' ' +
                       Chalk.bold(Moment().format('HH:mm:ss'));
            },
            formatter: function(options) {
                let level = '[' + options.level.toUpperCase() + ']';
                switch (level) {
                case '[INFO]': level = Chalk.green(level); break;
                case '[ERROR]': level = Chalk.red(level); break;
                }

                return options.timestamp() + ' ' + level +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            }
        })
    ]
});

export default logger;
