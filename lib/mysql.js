import MySQL from 'mysql';
import Config from 'config';
import logger from './logger';

logger.info('MySQL create connection');
const connection = MySQL.createConnection(
    Config.get('mysql')
);

export default class DB {
    static query(query) {
        logger.info('MySQL query', { query });

        return new Promise((resolve, reject) => {
            connection.query(query, (error, rows) => {
                if (error) {
                    logger.error('MySQL query error', { error });
                    return reject(error);
                }

                logger.info('MySQL query success');
                resolve(rows);
            });
        });
    }
}
